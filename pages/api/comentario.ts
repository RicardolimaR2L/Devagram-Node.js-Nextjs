import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import { PublicacaoModel } from '@/models/publicacaoModel'
import { politicaCORS } from "@/models/politicaCors";

const comentarioEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg>
) => {
  try {
    if (req.method === 'PUT') {
      const { UserId, id } = req.query
      const usuarioLogado = await UsuarioModel.findById(UserId)
      if (!usuarioLogado) {
        return res.status(400).json({ erro: 'Usuario nao encontrado' }) //verifica se o usuário existe e se foi encontrado
      }
      const publicacao = await PublicacaoModel.findById(id)
      if (!publicacao) {
        return res.status(400).json({ erro: 'Publicaçao nao encontrada' }) //verifica se a publicação existe
      }
      if (!req.body || !req.body.comentario || req.body.comentario.length < 2) {
        //verifica se o comentario existe e se existir se ele é válido

        return res.status(400).json({ erro: 'Comentario nao e valido' })
      }

      const comentario = {
        //objeto comentários
        usuarioId: usuarioLogado._id, //id do usuario que esta fazendo o comentário
        nome: usuarioLogado.nome, //Nome do usuário que esta fazendo o comentário
        comentario: req.body.comentario //comentário que foi feito pelo usuario
      }

      publicacao.comentarios.push(comentario) //atualiza o array de comentários
      await PublicacaoModel.findByIdAndUpdate(
        { _id: publicacao._id }, //atualiza a publicação adicionando o comentário.
        publicacao
      )
      return res.status(200).json({ msg: 'Comentario adicionado com sucesso' })
    }
    return res.status(405).json({ erro: 'Metodo informado invalido' })
  } catch (e) {
    console.log(e)
    return res
      .status(500)
      .json({ erro: 'Ocorreu erro ao adiconar o comentario' })
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(comentarioEndpoint)));
