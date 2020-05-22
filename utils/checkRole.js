// Cualquier middleware tiene que cumplir con la firma (req, res, next), como se requieren parámetros, se define una función
// que recibe estos parámetros y regresa otra función con la firma adecuada, pero que procesa los parámetros recibiods.
// Ver uso de checkRole en los consumidores.

exports.checkRole = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;
        if (roles.includes(role)) {
            // Si está dentro de los roles permitidos, pasa. Notar el "return"
            return next();
        } else {
            // 403 = Forbiden
            res.status(403).json({ error: "No tiene permisos para esta operación." });
        }
    }
}