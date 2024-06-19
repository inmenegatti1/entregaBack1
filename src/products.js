const express = require('express');
const ProductManager = require('../ProductManager');
const product = new ProductManager()
const { error } = require('console');
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.get('/products/:id', async(req, res)=>{
   let productId = parseInt(req.params.id)
   try{
       const resultado = await product.getProductsId(productId)
       res.send(resultado)
   }
   catch{
       res.send('ID inexistente');
   }
})

app.get('/products', async(req, res)=>{
   let limite = parseInt(req.query.limit)
   try{
       if(limite > 0){
          const data = await product.filtrarQtdProdutos(limite)
          res.send(data)
       }
       else{
           const resultado = await product.lerArquivo();
           const resJsonParse = JSON.parse(resultado)
            res.send(resJsonParse);
       }
   }
   catch{
       res.status(500).send('Erro interno do servidor');
   }
})

let arrayProdutos = []

app.post('/',async(req,res)=>{
   let produto = req.body
   
   if(!produto.title || !produto.description || !produto.code || !produto.price || !produto.status || !produto.stock || !produto.category){
      return res.status(400).send({status: 'error', error: "Valores incompletos"})
   }
   produto.thumbnails = []
   arrayProdutos.push(produto)
   product.addProduct(produto)
   res.send({status:'sucesso', message: 'produto adicionado'})
})


app.put('/produto/:id', async (req, res) => {
   const id = parseInt(req.params.id);
   const objEditar = req.body;

   try {
       const produtoAtualizado = await product.editarProdutoId(id, objEditar);
       res.send({ status: 'sucesso', message: 'Produto atualizado', produto: produtoAtualizado });
   } catch (error) {
       res.status(404).send({ status: 'error', message: error.message });
   }

});


app.delete('/:pid', async(req, res) =>{
   const id = parseInt(req.params.pid);
   console.log(id)
   await product.deletarItemId(id)
})

app.listen(8080, ()=>{
   console.log('ouvindo o express')
})

