const ItemModel = require('../models/itemModel');

/**
 * Controlador de páginas estáticas y generales del sitio web
 */
class PageController {
  /**
   * Renderiza la página de bienvenida (Home /)
   */
  static async renderHome(req, res, next) {
    try {
      // Obtenemos los primeros productos destacados para la portada
      const items = await ItemModel.findAll();
      const featuredItems = items.slice(0, 3);

      res.render('pages/index', {
        title: 'Inicio - DWBE Store Catálogo Oficial',
        description: 'Bienvenido al catálogo oficial de DWBE Store. Encuentra el mejor equipamiento informático.',
        featuredItems
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Renderiza la página informativa del proyecto (/about)
   */
  static renderAbout(req, res) {
    res.render('pages/about', {
      title: 'Acerca del Proyecto - DWBE TP1',
      description: 'Conoce los objetivos pedagógicos, arquitectura tecnológica y el equipo detrás de este proyecto.'
    });
  }
}

module.exports = PageController;

