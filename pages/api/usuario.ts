import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg'
import { UsuarioModel } from '../../models/UsuarioModel'
import { upload, uploadImagemCosmic } from '@/services/uploadImagemCosmic'
import nc from 'next-connect'
import { politicaCORS } from '@/middlewares/politicaCors'

const handler = nc()
  .use(upload.single('file'))
  .put(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      //req.query
      const{ UserId } = req?.query
      console.log(UserId)
      const usuario = await UsuarioModel.findById(UserId)
      if (!usuario) {
        return res.status(400).json({ erro: 'Usuario nao encontrado' })
      }

      //req.body é o corpo da requisição. é onde os dados são pegos para fazer as validações pois nele contem as informações do usuário.
      const { nome } = req.body.nome
      if (nome && nome.length > 2) {
        usuario.nome = nome
      }

      const { file } = req
      if (file && file.originalname) {
        const image = await uploadImagemCosmic(req)
        if (image && image.media.url) {
          usuario.file = image.media.url

          /*Aqui estamos enviando os bytes da imagem e transformando em um objeto do cosmic,
                dentro desse objeto do cosmic deve ter uma URL com os dados tratados, se ele tiver a url vamos salvar o objeto  */
        }
      }

      //alterar os dados no DB
      await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario)

      return res.status(200).json({ msg: 'Usuario alterado com sucesso' })
    } catch (e) {
      console.log(e)
      return res
        .status(400)
        .json({ erro: 'Nao foi possivel atualizar o usuario' + e })
    }
  })

  /*handler é um middleware entao nao tratamos os dados na requisição.
  a partir de agora teremos um método para cada operação no mesmo endpoint 
  um put e um get dentro do handler
  */
  .get(
    async (
      req: NextApiRequest,
      res: NextApiResponse<RespostaPadraoMsg | any>
    ) => {
      try {
        //Busca do usuario no banco de dados
        //usuario.senha = null é para não mostrar a senha na chamda da  api
        const { UserId } = req?.query
        const usuario = await UsuarioModel.findById(UserId)
        usuario.senha = null
        return res.status(200).json(usuario)
      } catch (e) {
        console.log(e)
        return res
          .status(400)
          .json({ erro: 'Nao foi possivel obter dados do usuario' })
      }
    }
  )

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)))
