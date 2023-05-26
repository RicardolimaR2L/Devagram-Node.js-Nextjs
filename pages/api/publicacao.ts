import type { NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagemCosmic'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { PublicacaoModel } from '../../models/publicacaoModel'
import { UsuarioModel } from '../../models/UsuarioModel'
import { politicaCORS } from '@/models/politicaCors'

const handler = nc()
  .use(upload.single('file'))
  .post(async (req: any, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { UserId } = req.query
      const usuario = await UsuarioModel.findById(UserId)

      if (!usuario) {
        return res.status(400).json({ erro: 'Usuario nao encontrado' })
      }

      if (!req || !req.body) {
        return res
          .status(400)
          .json({ erro: 'Parametros de entrada nao informados' })
      }
      const { descricao } = req?.body

      if (!descricao || descricao.length < 2) {
        return res.status(400).json({ erro: 'Descricao nao e valida' })
      }

      if (!req.file || !req.file.originalname) {
        return res.status(400).json({ erro: 'Imagem e obrigatoria' })
      }

      const image = await uploadImagemCosmic(req)
      const publicacao = {
        idUsuario: usuario._id,
        descricao,
        foto: image.media.url,
        data: new Date()
      }
      usuario.publicacoes++
      await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario)

      await PublicacaoModel.create(publicacao)

      res.status(200).json({ msg: 'Publicação criada com sucesso' })
    } catch (e) {
      console.log(e)
      res.status(400).json({ erro: 'Erro ao cadastrar a publicação' })
    }
  })

export const config = {
  api: {
    bodyParser: false
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)))
