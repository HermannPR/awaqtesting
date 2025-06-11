const express = require('express');
//const templates = require('./Templates/templates');
const usersRest = require('./API/usersRestController');
const imageRest = require('./API/imageRestController');
const constants = require("../constants");
const adminRest = require('./API/SAdminRestController');
const formRest = require('./API/formRestController');
const aiChatRest = require('./API/aiChatController');
const dashboardStatsRest = require('./API/dashboardStatsController');


const router = express.Router();



//Rutas de la API
router.post(constants.contextURL + constants.apiURL + "/login", usersRest.execLogin);
router.get(constants.contextURL + constants.apiURL + "/getusers", usersRest.authenticateTokenAdmin, usersRest.getUsers);
router.get(constants.contextURL + constants.apiURL + "/findUser/:idUsuario", usersRest.authenticateToken, usersRest.findUser);
router.post(constants.contextURL + constants.apiURL + "/insertUser", usersRest.insertUser);
router.put(constants.contextURL + constants.apiURL + "/updateUser", usersRest.authenticateToken, usersRest.updateUser);
router.delete(constants.contextURL + constants.apiURL + "/deleteUser", usersRest.authenticateToken, usersRest.deleteUser);

//convocatorias
router.post(constants.contextURL + constants.apiURL + "/insertConvocatorias/:idUsuario", usersRest.authenticateToken, usersRest.insertConvocatorias);
router.get(constants.contextURL + constants.apiURL + "getConvocatoriasAbiertas", usersRest.authenticateToken, usersRest.getConvocatoriasAbiertas);
router.get(constants.contextURL + constants.apiURL + "getConvocatoriasCerradas", usersRest.authenticateToken, usersRest.getConvocatoriasCerradas);

//Imagen
router.post(constants.contextURL + constants.apiURL + "/imageUpload", usersRest.authenticateToken, imageRest.upload, imageRest.processUpload);
router.get(constants.contextURL + constants.apiURL + "/getUserProfileImage/:userId", usersRest.authenticateToken, imageRest.getUserProfileImage);
//forms
router.post(constants.contextURL + constants.apiURL + "/insertVClimaticas", usersRest.authenticateToken, formRest.insertVClimaticas);
router.post(constants.contextURL + constants.apiURL + "/insertCamarasTrampa", usersRest.authenticateToken, formRest.insertCamarasTrampa);
router.post(constants.contextURL + constants.apiURL + "/insertFaunaBusquedaLibre", usersRest.authenticateToken, formRest.insertFaunaBusquedaLibre);
router.post(constants.contextURL + constants.apiURL + "/insertFaunaPuntoConteo", usersRest.authenticateToken, formRest.insertFaunaPuntoConteo);
router.post(constants.contextURL + constants.apiURL + "/insertFaunaTransecto", usersRest.authenticateToken, formRest.insertFaunaTransecto);
router.post(constants.contextURL + constants.apiURL + "/insertValidacionCobertura", usersRest.authenticateToken, formRest.insertValidacionCobertura);
router.post(constants.contextURL + constants.apiURL + "/insertParcelaVegetacion", usersRest.authenticateToken, formRest.insertParcelaVegetacion);

//Admin routes
router.get(constants.contextURL + constants.apiURL + "/getRegistrosPorUsuario/:idUsuario", usersRest.authenticateTokenAdmin, adminRest.getRegistrosPorUsuario);
router.get(constants.contextURL + constants.apiURL + "/getRegistros/:idUsuario", usersRest.authenticateTokenAdmin, adminRest.getRegistros);

//Super admin
router.get(constants.contextURL + constants.apiURL + "/getUsersNA", usersRest.authenticateTokenSAdmin, adminRest.getUsersNoAceptados);
router.post(constants.contextURL + constants.apiURL + "/aceptarUsuario/:idUsuario", usersRest.authenticateTokenSAdmin, adminRest.AceptarUsuario);
router.post(constants.contextURL + constants.apiURL + "/rechazarUsuario/:idUsuario", usersRest.authenticateTokenSAdmin, adminRest.RechazarUsuario);
router.post(constants.contextURL + constants.apiURL + "/aceptarUsuariosAll", usersRest.authenticateTokenSAdmin, adminRest.AceptarUsuariosAll);
router.get(constants.contextURL + constants.apiURL + "/listpendientes", usersRest.authenticateTokenSAdmin, adminRest.getPendientes);
router.get(constants.contextURL + constants.apiURL + "/usuariosActivos", usersRest.authenticateTokenSAdmin, adminRest.usuariosActivos);
router.get(constants.contextURL + constants.apiURL + "/totalRegistros", usersRest.authenticateTokenSAdmin, adminRest.totalRegistros);
router.get(constants.contextURL + constants.apiURL + "/usuariosInactivos", usersRest.authenticateTokenSAdmin, adminRest.usuariosInactivos);

// Nuevas rutas para usuarios rechazados
router.get(constants.contextURL + constants.apiURL + "/getUsersRechazados", usersRest.authenticateTokenSAdmin, adminRest.getUsersRechazados);
router.post(constants.contextURL + constants.apiURL + "/reactivarUsuario/:idUsuario", usersRest.authenticateTokenSAdmin, adminRest.ReactivarUsuario);
router.get(constants.contextURL + constants.apiURL + "/getRechazadosCount", usersRest.authenticateTokenSAdmin, adminRest.getRechazadosCount);

// AI Chat routes
router.post(constants.contextURL + constants.apiURL + "/ai-chat", aiChatRest.aiChat);
router.get(constants.contextURL + constants.apiURL + "/ai-config", aiChatRest.getAiConfig);

// Dashboard Statistics routes
router.get(constants.contextURL + constants.apiURL + "/stats/general", usersRest.authenticateTokenAdmin, dashboardStatsRest.getGeneralStats);
router.get(constants.contextURL + constants.apiURL + "/stats/activity", usersRest.authenticateTokenAdmin, dashboardStatsRest.getActivityStats);
router.get(constants.contextURL + constants.apiURL + "/stats/timeseries", usersRest.authenticateTokenAdmin, dashboardStatsRest.getTimeSeriesStats);
router.get(constants.contextURL + constants.apiURL + "/stats/superadmin", usersRest.authenticateTokenSAdmin, dashboardStatsRest.getSuperAdminStats);

// Super Admin specific routes
router.get(constants.contextURL + constants.apiURL + "/users/pending", usersRest.authenticateTokenSAdmin, dashboardStatsRest.getPendingUsers);
router.post(constants.contextURL + constants.apiURL + "/users/approve-all", usersRest.authenticateTokenSAdmin, dashboardStatsRest.approveAllUsers);
router.get(constants.contextURL + constants.apiURL + "/auth/profile", usersRest.authenticateToken, dashboardStatsRest.getUserProfile);

module.exports = router;