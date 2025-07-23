const {Product} = require('../models/products-model');


module.exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};


module.exports.getProductById = async (req, res) => {
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

module.exports.getProductByLibelle = async (req, res) => {
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

module.exports.createProduct = async (req, res) => {
    try {
        const { libelle, description, images, prix, categorie } = req.body;
        const newProduct = await Product.create({ libelle, description, images, prix, categorie });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
}


module.exports.editProduct = async (req, res) => {
  const id = req.params.id;
  const { libelle, description, images, prix, categorie } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.update({ libelle, description, images, prix, categorie });
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

module.exports.deleteProduct = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
