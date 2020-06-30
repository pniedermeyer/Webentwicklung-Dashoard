import express from "express";
import { getConnection } from "typeorm";
import _ from 'lodash'

const GUID_HEADER = 'x-guid';

async function getHandler(req: express.Request, res: express.Response) {
  try {
    const result = await getConnection().query(
      `SELECT 
            'zoom',
            'graphs_shown' AS 'graphsShown',
            'lkId' AS 'lk_ld',
            'blId' AS 'bl_id',
            'metric',
            'table'
       FROM 'settings' 
       WHERE 'guid' = ?;`,
      [req.header(GUID_HEADER)]
    );

    if (result.length > 0) {
      res.send(_.pickBy(result[0], (value, key) => req.body[key]));
    } else {
      res
        .status(404)
        .send(makeError("guid does not exist in database"));
    }
  } catch (error) {
    res.status(500).send(makeInternalError());
  }
}

function authorize(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    
    if (!req.header(GUID_HEADER)) {
        res.status(400).send(makeError("header parameter x-guid is missing"));
    } else {
        next();
    }
}

async function putHandler(
  req: express.Request,
  res: express.Response
): Promise<void> {
  try {
    const result = await getConnection().query(
      `
            INSERT INTO 'settings'
            SET
                'zoom' = COALESCE($2, DEFAULT),
                'graphs_shown' = COALESCE($3, DEFAULT),
                'lk_ld' = COALESCE($4, DEFAULT),
                'bl_id' = COALESCE($5, DEFAULT),
                'metric' = COALESCE($6, DEFAULT),
                'table' = COALESCE($7, DEFAULT)
            WHERE 'guid' = $1
            ON CONFLICT('guid')
            DO
                UPDATE SET
                    'zoom' = COALESCE($2, 'zoom'),
                    'graphs_shown' = COALESCE($3, 'graphs_shown'),
                    'lk_ld' = COALESCE($4, 'lk_ld'),
                    'bl_id' = COALESCE($5, 'bl_id'),
                    'metric' = COALESCE($6, 'metric'),
                    'table' = COALESCE($7, 'table')
                WHERE 'guid' = $1;
        `,
      [
        req.header(GUID_HEADER),
        req.body.zoom ?? null,
        req.body.graphsShown ?? null,
        req.body.lkId ?? null,
        req.body.blId ?? null,
        req.body.metric ?? null,
        req.body.table ?? null,
      ]
    );

    if (result.affectedRows > 0) {
      res.send();
    } else {
      res.status(500).send(makeError('could not update database'));
    }
  } catch (error) {
    res.status(500).send(makeInternalError());
  }
}

interface Error {
  isError: true;
  msg: string;
}

function makeError(msg: string): Error {
  return {
    isError: true,
    msg,
  };
}

function makeInternalError(): Error {
  return {
    isError: true,
    msg: "internal error",
  };
}

export = {
  get: {
    handler: getHandler,
    authorize,
  },
  put: {
    handler: putHandler,
    authorize,
  },
};
