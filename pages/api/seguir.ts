import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg'
import { UsuarioModel } from '@/models/UsuarioModel'
import { seguidorModel } from '@/models/seguidorModel'
import { politicaCORS } from '@/middlewares/politicaCors'
const seguirEndPoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === 'PUT') {
      const { UserId, id } = req?.query
      /* Os pontos de interrogação no código req?.body?.query indicam o uso do operador de encadeamento opcional em linguagens como TypeScript ou JavaScript.
        Esse operador permite acessar propriedades de objetos que podem ser nulas ou indefinidas sem causar um erro. 
        Ele verifica se cada propriedade ao longo da cadeia de acesso existe antes de tentar acessá-la.

      */

      const usuarioLogado = await UsuarioModel.findById(UserId)

      //id do usuario vindo do token = usuario logado/autenticado = quem esta fazendo as ações
      if (!usuarioLogado) {
        return res.status(400).json({ erro: 'usuario logado nao encontrado' })
      }
      //id do usuario a ser seguido - query

      const usuarioASerSeguido = await UsuarioModel.findById(id)
      if (!usuarioASerSeguido) {
        return res
          .status(400)
          .json({ erro: 'usuario a ser seguido nao encontrado' })
      }
      //buscar se EU LOGADO sigo ou nao esse usuario
      const euJaSigoEsseUsuario = await seguidorModel.find({
        usuarioId: usuarioLogado._id,
        usuarioSeguidoId: usuarioASerSeguido._id
      })
      if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
        // sinal que eu ja sigo esse usuario
        euJaSigoEsseUsuario.forEach(
          async (e: any) =>
            await seguidorModel.findByIdAndDelete({ _id: e._id }) //O "e" dentro da pesquisa indica cada item da lista que o forEach vai retornar.
        )

        usuarioLogado.seguindo--
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        )
        usuarioASerSeguido.seguidores--
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido
        )

        return res
          .status(200)
          .json({ msg: 'Deixou de seguir o usuario com sucesso' })
      } else {
        // sinal que eu não sigo esse usuário
        const seguidor = {
          usuarioId: usuarioLogado._id,
          usuarioSeguidoId: usuarioASerSeguido._id
        }
        await seguidorModel.create(seguidor)

        // adicionar um seguindo no usuário logado
        usuarioLogado.seguindo++
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioLogado._id },
          usuarioLogado
        )

        // adicionar um seguidor no usuário seguido
        usuarioASerSeguido.seguidores++
        await UsuarioModel.findByIdAndUpdate(
          { _id: usuarioASerSeguido._id },
          usuarioASerSeguido
        )

        return res.status(200).json({ msg: 'Usuario seguido com sucesso' })
      }
    }

    return res.status(405).json({ erro: 'Metodo informado nao existe' })
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ erro: ' Nao foi possivel seguir/deseguir o usuario informado' })
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(seguirEndPoint)))
