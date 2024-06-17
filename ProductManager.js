 const fs = require('fs')
const path = require('path')


class ProdructManager{
    constructor(){
        this.path = './product.json'
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
    
        return 1; // Caso o array esteja vazio
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

    async editarProdutoId(id, objEditar){
        const data = await this.lerArquivo()
        const dataParse = JSON.parse(data)

        const posicao = dataParse.findIndex(produto=> produto.id === id)
        if(posicao > -1){
            const idItemArray = dataParse[posicao].id
            dataParse[posicao] = objEditar
            dataParse[posicao].id = idItemArray
        }
        else{
            console.log('nao existe nenhum produto com esse id')
        }
        await this.salvarItensArquivo(dataParse)
    }
    
}

const product = new ProdructManager()

const teste = {
    name:'fsdsdfdsfds'
}


product.addProduct(teste)
