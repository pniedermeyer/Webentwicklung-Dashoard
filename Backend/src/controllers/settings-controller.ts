import express from "express";
import { getConnection } from "typeorm";
import _ from 'lodash'

const GUID_HEADER = 'x-guid';

async function getHandler(req: express.Request, res: express.Response) {
  try {
    const result = await getConnection().query(
      `
        UPDATE "settings" 
        SET 
            last_accessed = NOW() 
        WHERE "guid" = $1
        RETURNING "data";
      `,
      [req.header(GUID_HEADER)]
    );

        console.log(result)

    if (result.length > 0) {
      res.send(result[0][0].data);
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
    await getConnection().query(
      `
            INSERT INTO "settings" (
                "guid", 
                "last_accessed", 
                "data"
            ) 
            VALUES (
                $1,
                NOW(),
                $2
            )
            ON CONFLICT("guid")
            DO
                UPDATE SET
                    "last_accessed" = NOW(),
                    "data" = $2;
        `,
      [
        req.header(GUID_HEADER),
        req.body
      ]
    );

      res.send();
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
