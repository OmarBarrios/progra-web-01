const mongoose = require('mongoose');
const Role = require('../models/role.schema');

async function insertRoles() {
    try {
      // Crear roles
      const adminRole = new Role({
        id: 1,
        name: 'admin',
      });
  
      const moderatorRole = new Role({
        id: 2,
        name: 'moderator',
      });
  
      const userRole = new Role({
        id: 3,
        name: 'user',
      });
  
      // Verificar si los roles ya existen antes de insertarlos
      const existingAdminRole = await Role.findOne({ id: 1 });
      const existingModeratorRole = await Role.findOne({ id: 2 });
      const existingUserRole = await Role.findOne({ id: 3 });

      // Insertar solo si no existen
      if (!existingAdminRole) {
        await adminRole.save();
        console.log('Rol admin insertado exitosamente');
      } else {
        console.log('El rol admin ya existe');
      }
  
      if (!existingModeratorRole) {
        await moderatorRole.save();
        console.log('Rol moderator insertado exitosamente');
      } else {
        console.log('El rol moderator ya existe');
      }
  
      if (!existingUserRole) {
        await userRole.save();
        console.log('Rol user insertado exitosamente');
      } else {
        console.log('El rol user ya existe');
      }
  
      console.log('Operación de inserción completa');
    } catch (error) {
      console.error('Error al insertar roles:', error);
    }
  }

  insertRoles();