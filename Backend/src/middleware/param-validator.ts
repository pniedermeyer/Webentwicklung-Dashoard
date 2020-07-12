import Ajv from 'ajv';
import express from 'express'

export default (schema: object, property: 'body' | 'query' | 'header') => {
    const ajv = new Ajv({useDefaults: true});

    const validate = ajv.compile(schema);

    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log(req[property])
        const result = validate(req[property]);
        console.log(result)
        console.log(req[property])
        if(result) {
            console.log(req[property])
            next();
        } else {
            console.log(validate.errors!)
            res.status(400).send({isError: true, msg: `could not validate ${property}`})
        }
    }
}
