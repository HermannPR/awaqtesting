const dataSource = require('../Datasource/MySQLMngr');
const hashService = require('./hashPassword');
const imageService = require('./imageUploadService');
require('dotenv').config();
/** 
 * @returns
 */
async function getUsers(){
    let qResult;
    try{        let query = `SELECT u.idUsuario, u.Nombre, u.Apellidos, u.email, u.rol, u.estado, count(fi.idCreador) as TotalRegistros
        FROM Usuarios u left join formularioinicial fi on fi.idCreador = u.idUsuario
        WHERE u.estado = ?
        group by u.idUsuario, u.Nombre, u.Apellidos, u.email, u.rol, u.estado
        order by u.idUsuario
        `;
        let params = ['A'];
        qResult = await dataSource.getDataWithParams(query, params);
    }catch(err){
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

/**
 * @param {int} idUsuario
 * @returns
 */
async function findUser(idUsuario){
    let qResult;
    try{
        let query = "SELECT * FROM Usuarios WHERE idUsuario = ?";
        let params = [idUsuario];
        qResult = await dataSource.getDataWithParams(query, params);
    }catch(err){
        qResult = new dataSource.QueryResult(false,[],0,0,err.message);
    }
    return qResult;
}
async function getValores(email)
{
    let qResult;
    try
    {
        let query = "SELECT estado, rol FROM Usuarios WHERE email = ?";
        let params = [email];
        qResult = await dataSource.getDataWithParams(query, params);
    }
    catch(err)
    {
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

/**
 * @param {*} user
 * @returns
 */

/*la logica ser que, cheque si el usuario tiene imagen
Si si la tiene, la subira a la base de datos en la tabla imagenes con el idUser. Si no la tiene, le asignara una default que estara ya en la DB
Despues, alterara el registro del usuario insertado en la tabla usuario, para que tenga el ID de imagen que le corresponde*/
async function insertUser(user){
    let qResult;
    try{
        let query = "INSERT INTO usuario (Nombre, Apellidos, email, password, pais, numerotel, region, ciudad, nombreOrganizacion, descOrganizacion, rol, estado, idResponsable) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        const salt = hashService.getSalt();
        const hash = await hashService.encryptPassword(user.password, salt);
        const hash_password = salt + hash;
        let params = [
            user.Nombre,
            user.Apellidos,
            user.email,
            hash_password, 
            user.pais,
            user.numerotel,
            user.region,
            user.ciudad,
            user.nombreOrganizacion,
            user.descOrganizacion,
            user.rol,
            user.estado,
            user.idResponsable
        ];
        qResult = await dataSource.insertData(query, params);
        /***/
        const idUser = qResult.getGenId();
        let idImagen = 1;
        console.log('📦 user.imagen recibido:', user.imagen);
        if(user.imagen)
        {
            let imageObj = {...user.imagen, usuario_carga: idUser};
            let qResultImg = await imageService.uploadedImageLog(imageObj);
            if (qResultImg && qResultImg.getStatus()) {
                idImagen = qResultImg.getGenId();
            }
        }
        else
        {
            let imageObj = {
                base64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
                name: "default.jpg",
                usuario_carga: idUser
            };
            let qResultImg = await imageService.uploadedImageLog(imageObj);
            if (qResultImg && qResultImg.getStatus()) {
                idImagen = qResultImg.getGenId();
            }
        }
        let query2 = "UPDATE usuario SET idImagen = ? WHERE idUsuario = ?";
        let params2 = [idImagen, idUser];
        await dataSource.updateData(query2, params2);
        return new dataSource.QueryResult(true, [idUser, idImagen],1, qResult.getGenId());
    }
    catch(err){
        console.error('Error al insertar usuario:', err.message);
        return new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
}

/**
 * @param {*} user
 * @returns
 */
async function updateUser(user, idUsuario){
    let qResult;
    try{
        let query = "UPDATE usuario SET Nombre = ?, Apellidos = ?, email = ?, password = ?, pais = ?, numerotel = ?, region = ?, ciudad = ?, nombreOrganizacion = ?, descOrganizacion = ? WHERE idUsuario = ?";

        let params = [
            user.Nombre,
            user.Apellidos,
            user.email,
            user.password,
            user.pais,
            user.numerotel,
            user.region,
            user.ciudad,
            user.nombreOrganizacion,
            user.descOrganizacion,
            idUsuario
        ];
        qResult = await dataSource.updateData(query, params);
    }catch(err){
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}
/**
 * @param {int} user_id
 * @returns
 */
async function deleteUser(user_id){
    let qResult;
    try{
        let query = "DELETE FROM Usuarios WHERE idUsuario = ?";
        let params = [user_id];
        qResult = await dataSource.deleteUser(query, params);
    }catch(err){
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}
/**
 * @param {*} Conv
 * @param {int} idUsuario
 * @returns
 */
async function insertConvocatorias(Conv, idUsuario){
    let qResult;
    try{
        let query = "INSERT INTO convocatorias (nombreConv, FechaCierre, sitio_web, region, organizacion, pais, descripcion, idUsuario) VALUES (?,?,?,?,?,?,?,?)";
        let params = [
            Conv.nombreConv,
            Conv.FechaCierre,
            Conv.sitio_web,
            Conv.region,
            Conv.organizacion,
            Conv.pais,
            Conv.descripcion,
            idUsuario
        ];
        qResult = await dataSource.insertData(query, params);
        return new dataSource.QueryResult(true, [Conv.idConvocatoria], 1, qResult.getGenId());
    }
    catch(err){
        console.error('Error al insertar convocatoria:', err.message);
        return new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
}

async function getConvocatoriasAbiertas() {
    let qResult;
    try {
        let query = "SELECT * FROM convocatorias WHERE FechaCierre > NOW()";
        qResult = await dataSource.getData(query);
        return new dataSource.QueryResult(true, qResult.getRows(), qResult.getRows().length, 0);
    }
    catch(err) {
        console.error('Error al obtener convocatorias abiertas:', err.message);
        return new dataSource.QueryResult(false,  [], 0, 0, err.message);
    }
}

async function getConvocatoriasCerradas() {
    let qResult;
    try {
        let query = "SELECT * FROM convocatorias WHERE FechaCierre <= NOW()";
        qResult = await dataSource.getData(query);
        return new dataSource.QueryResult(true, qResult.getRows(), qResult.getRows().length, 0);
    }
    catch(err) {
        console.error('Error al obtener convocatorias cerradas:', err.message);
        return new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
}

module.exports = {
    getUsers,
    findUser,
    insertUser,
    updateUser,
    deleteUser,
    getValores,
    insertConvocatorias,
    getConvocatoriasAbiertas,
    getConvocatoriasCerradas
}