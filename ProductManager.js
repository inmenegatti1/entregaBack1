 const fs = require('fs')
const path = require('path')


class ProdructManager{
    constructor(){
        this.path = path.join(__dirname,'produtos.json')
        this.id = 1
    }
    async verificarTamId() {
        let dataTam = 0;
        let dataParse = [];
    
        try {
            const data = await this.lerArquivo();
            dataParse = JSON.parse(data);
            dataTam = dataParse.length;
        } catch (error) {
            console.log('Erro ao ler o arquivo ou ao fazer o parse dos dados:', error);
        }
    
        if (dataTam > 0) {
            return dataParse[dataTam -1].id + 1;
        }
    
        return 1
    }

    async addProduct(obj){
        let arrayDataFs = []
        try{
            const data = await this.lerArquivo()
            const parseData = JSON.parse(data)
            arrayDataFs = parseData

        }
        catch{
            console.log('erro ao abrir arquivo/ adicionar produto')
        }
        let idProduto = await this.verificarTamId()
        obj.id = idProduto
        arrayDataFs.push(obj)
        await this.salvarItensArquivo(arrayDataFs)
    }

    async lerArquivo(){
        return await fs.promises.readFile(this.path, 'utf-8')
    }

    async salvarItensArquivo(data){
         await fs.promises.writeFile(this.path, JSON.stringify(data))
    }

    async editarProdutoId(id, objEditar) {
        const data = await this.lerArquivo();
        const dataParse = JSON.parse(data);
    
        const posicao = dataParse.findIndex(produto => produto.id === id);
        if (posicao > -1) {
            const produtoExistente = dataParse[posicao];
            const produtoAtualizado = { ...produtoExistente, ...objEditar, id: produtoExistente.id };
            dataParse[posicao] = produtoAtualizado;
            await this.salvarItensArquivo(dataParse);
            return produtoAtualizado;
        } else {
            throw new Error('Não existe nenhum produto com esse ID');
        }
    }

    async deletarItemId(id){
        const data = await this.lerArquivo()
        const dataParse = JSON.parse(data)
        console.log(id)
        const posicao = dataParse.findIndex(produto => produto.id === id)
        console.log(posicao)

        if(posicao > -1){
            dataParse.splice(posicao,1)
            await this.salvarItensArquivo(dataParse)
        }

    }

    async getProductsId(id){
        const data = await this.lerArquivo()
        const dataParse = JSON.parse(data)
        const produtoEncontrado = dataParse.find(product =>product.id === id)
        return produtoEncontrado
    }
    
}
module.exports = ProdructManager;
const product = new ProdructManager()


