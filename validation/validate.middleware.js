
export const validateRequest = (schema, property = 'body') => {
    return (req, res, next) => {
        // Enforce a strict whitelist of request properties to validate and retrieve target object
        let target;
        if (property === 'body') {
            target = req.body;
        } else if (property === 'query') {
            target = req.query;
        } else if (property === 'params') {
            target = req.params;
        } else {
            return res.status(400).json({ error: "Invalid request property for validation" });
        }

        const { error, value } = schema.validate(target, {
            abortEarly: false,
            stripUnknown: true,
            errors: {
                label: 'key'
            }
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message.replace(/"/g, ''));
            return res.status(400).json({ errors: errorMessages });
        }

        // Assign validated value back using explicit properties
        if (property === 'body') {
            req.body = value;
        } else if (property === 'query') {
            req.query = value;
        } else if (property === 'params') {
            req.params = value;
        }

        next();
    };
};
