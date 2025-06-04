const dataSource = require('../Datasource/MySQLMngr');
const hashService = require('./hashPassword');
const imageService = require('./imageUploadService');
require('dotenv').config();
/** 
 * @returns
 */
async function getUsers(){
    let qResult;
    try{
        let query = `SELECT u.idUsuario, u.Nombre, u.Apellidos, u.email, u.rol, u.estado, count(fi.idCreador) as TotalRegistros
        FROM usuario u left join formularioinicial fi on fi.idCreador = u.idUsuario
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
        let query = "SELECT * FROM usuario WHERE idUsuario = ?";
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
        let query = "SELECT estado, rol FROM usuario WHERE email = ?";
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
        let query2 = "UPDATE usuario SET idImagen = ? WHERE idUsuario = ?";
        let params2 = [idImagen, idUser];
        await dataSource.updateData(query2, params2);
        /***/
        return {
            status: "success",
            idUser,
            idImagen
        };        
    }catch(err){
        return{
            status: "error",
            message: err.message
        }
    }
}

/**
 * @param {*} user
 * @returns
 */
async function updateUser(user, idUsuario){
    let qResult;
    try{
        let query = "UPDATE usuario SET Nombre = ?, Apellidos = ?, email = ?, password = ?, pais = ?, numerotel = ?, region = ?, ciudad = ?, nombreOrganizacion = ?, descOrganizacion = ?, rol = ?, estado = ?, idResponsable = ? WHERE idUsuario = ?";
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
            user.idResponsable,
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
        let query = "DELETE FROM usuario WHERE idUsuario = ?";
        let params = [user_id];
        qResult = await dataSource.deleteUser(query, params);
    }catch(err){
        qResult = new dataSource.QueryResult(false, [], 0, 0, err.message);
    }
    return qResult;
}

module.exports = {
    getUsers,
    findUser,
    insertUser,
    updateUser,
    deleteUser,
    getValores
}