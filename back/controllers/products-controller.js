const {Product} = require('../models/products-model');
const path = require('path');
const fs = require('fs');

module.exports.GetProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

module.exports.GetProductById = async (req, res) => {
  try{
    const {id} = req.params;
    const product = await Product.findByPk(id);
    res.status(200).json(product);
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product by ID' });
  }
};

module.exports.GetProductByLibelle = async (req, res) => {
    try{
    const {libelle} = req.params;
    const product = await Product.findOne({
      where: {
        libelle: libelle
      }
    });
    res.status(200).json(product);
  }
  catch(error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product by Name' });
  }
};

module.exports.CreateProduct = async (req, res) => {
    try {
        const { libelle, description, prix, categorie } = req.body;
        const imagePath = req.file ? `/assets/${req.file.filename}` : null;
        const newProduct = await Product.create({ libelle, description, imagePath, prix, categorie });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}


module.exports.EditProduct = async (req, res) => {
  const id = req.params.id;
  const { libelle, description, prix, categorie } = req.body;

  const imagePath = req.file ? `/assets/${req.file.filename}` : null;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Supprimer ancienne image si une nouvelle est uploadée
    if (req.file && product.imagePath) {
      const oldPath = path.join(__dirname, '..', product.imagePath);
      fs.unlink(oldPath, err => {
        if (err) console.warn('old image not deleted :', err.message);
      });
    }

    await product.update({ libelle, description, imagePath, prix, categorie });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

module.exports.DeleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Supprimer ancienne image si non null
    if (product.imagePath) {
      const oldPath = path.join(__dirname, '..', product.imagePath);
      fs.unlink(oldPath, err => {
        if (err) console.warn('old image not deleted :', err.message);
      });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
