import express from 'express'
import { getConnection } from 'typeorm'
import _ from 'lodash'

const GUID_HEADER = 'x-guid';

async function getHandler(req: express.Request, res: express.Response) {
    console.log(req.body)
  try {
    const result = await getConnection().query(
      `
        UPDATE "settings" 
        SET 
            last_accessed = NOW() 
        WHERE "guid" = $1
        RETURNING
            "zoom",
            "graphs_shown" AS graphsShown,
            "lk_id" AS lkId,
            "bl_id" AS blId,
            "metric",
            "table";
      `,
      [req.header(GUID_HEADER)]
    )

        console.log(result[0][0])

    if (result.length > 0) {
        // postgres returns all names in lowercase, the following line will convert all keys in the body to lowercase
        req.body = _.mapKeys(req.body, (value, key) => key.toLowerCase())
        const response = _.pickBy(result[0][0], (value, key) => !!req.body[key])
        if (response.table) {
            response.table = JSON.parse(response.table)
        }

      res.send(response)
    } else {
      res
        .status(404)
        .send(makeError('guid does not exist in database'))
    }
  } catch (error) {
    res.status(500).send(makeInternalError())
  }
}

function authorize(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction) {
    
    if (!req.header(GUID_HEADER)) {
        res.status(400).send(makeError('header parameter x-guid is missing'))
    } else {
        next()
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
                "zoom", 
                "graphs_shown", 
                "lk_id", 
                "bl_id", 
                "metric", 
                "table"
            ) 
            VALUES (
                $1,
                NOW(),
                COALESCE($2, 1),
                COALESCE($3, 1),
                COALESCE($4, 0),
                COALESCE($5, 0),
                COALESCE($6, 'cases_per_100_k'),
                COALESCE($7, '[]')
            )
            ON CONFLICT("guid")
            DO
                UPDATE SET
                    "last_accessed" = NOW(),
                    "zoom" = COALESCE($2, settings.zoom),
                    "graphs_shown" = COALESCE($3, settings.graphs_shown),
                    "lk_id" = COALESCE($4, settings.lk_id),
                    "bl_id" = COALESCE($5, settings.bl_id),
                    "metric" = COALESCE($6, settings.metric),
                    "table" = COALESCE($7, settings.table);
        `,
      [
        req.header(GUID_HEADER),
        req.body.zoom ?? null,
        req.body.graphsShown ?? null,
        req.body.lkId ?? null,
        req.body.blId ?? null,
        req.body.metric ?? null,
        req.body.table ? JSON.stringify(req.body.table) : null
      ]
    )

      res.send()
  } catch (error) {
    res.status(500).send(makeInternalError())
  }
}

interface Error {
  isError: true
  msg: string
}

function makeError(msg: string): Error {
  return {
    isError: true,
    msg
  }
}

function makeInternalError(): Error {
  return {
    isError: true,
    msg: 'internal error'
  }
}

export = {
  get: {
    handler: getHandler,
    authorize
  },
  put: {
    handler: putHandler,
    authorize
  }
}
