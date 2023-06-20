import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import { PublicacaoModel } from '@/models/publicacaoModel'
import { politicaCORS } from '@/middlewares/politicaCors'

const likeEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any[]>
) => {
  try {
    if (req.method === 'PUT') {
      //id da publicação
      const { id } = req?.query
      const publicacao = await PublicacaoModel.findById(id)
      if (!publicacao) {
        return res.status(400).json({ erro: 'Publicação nao encontrada' })
      }

      // id do usuario que esta curtindo
      const { UserId } = req?.query
      const usuario = await UsuarioModel.findById(UserId)
      if (!usuario) {
        return res.status(400).json({ erro: 'usuario nao encontrado' })
      }

      //como vamos adiministrar os likes?
      const indexDoUsuarioNoLike = publicacao.likes.findIndex(
        (e: any) => e.toString() === usuario._id.toString()
        // toString converte um objeto em uma representação de string, no nosso caso estamos pegado o object id, ou seja a sequencia de numeros que compoem o ID do usuario
      )
      //no trecho abaixo temos  o IF/ELSE funcionando como um toogle onde um clique da o like e ao clicar novamente da o deslike

      //se o index for > -1 o usuario ja curti a foto
      if (indexDoUsuarioNoLike != -1) {
        publicacao.likes.splice(indexDoUsuarioNoLike, 1)
        await PublicacaoModel.findByIdAndUpdate(
          { _id: publicacao._id },
          publicacao
        )
        return res
          .status(200)
          .json({ msg: 'Publicação descurtida com sucesso' })
      } else {
        //se o index for -1 o usuario nao curtiu a foto
        publicacao.likes.push(usuario._id)
        await PublicacaoModel.findByIdAndUpdate(
          { _id: publicacao._id },
          publicacao
        )
        return res.status(200).json({ msg: 'Publicaçao curtida com sucesso' })
      }
    }
    return res.status(405).json({ erro: 'metodo informado nao é valido' })
  } catch (e) {
    return res
      .status(500)
      .json({ erro: 'ocorreu ao curtir/descurtir uma publicação' })
  }
}
export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)))
