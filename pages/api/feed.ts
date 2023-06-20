import type { NextApiRequest, NextApiResponse } from 'next'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '../../models/UsuarioModel'
import { PublicacaoModel } from '../../models/publicacaoModel'
import { seguidorModel } from '@/models/seguidorModel'
import { politicaCORS } from '@/middlewares/politicaCors'

const feedEndpoint = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    if (req.method === 'GET') {
      console.log(UsuarioModel)
      if (req?.query?.id) {
        const usuario = await UsuarioModel.findById(req?.query?.id) //Busca pelo usuario no banco de dados
        if (!usuario) {
          return res.status(400).json({ erro: 'usuario nao encontrado' }) //msgm de erro caso o usuario nao exista
        }
        const publicacoes = await PublicacaoModel.find({
          idUsuario: usuario._id
        }).sort({ data: -1 })
        //Captura das publicacoes do usuario pelo UserId, ordenando de forma decresente de acordo com a data da mais nova para a mais antiga
        return res.status(200).json(publicacoes)
      } else {
        const { UserId } = req.query
        const usuarioLogado = await UsuarioModel.findById(UserId)
        if (!usuarioLogado) {
          return res.status(400).json({ erro: 'Usuario nao encontrado' })
        }
        const seguidores = await seguidorModel.find({
          usuarioId: usuarioLogado._id
        })
        const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId) //Cria uma lista de ids dos usuarios que estao sendo seguidos pelo usuarioLogado

        const publicacoes = await PublicacaoModel.find({
          $or: [
            { idUsuario: usuarioLogado._id }, //Busca as minhas  publicações.
            { idUsuario: seguidoresIds } // Busca as publicações de quem eu estou seguindo.
          ]
        }).sort({ data: -1 })

        //Esse trecho foi criado para adicionar o usuario dentro da lista que buscamos
        const resultado = []
        for (const publicacao of publicacoes) {
          const usuarioDaPublicacao = await UsuarioModel.findById(
            publicacao.idUsuario
          )
          if (usuarioDaPublicacao) {
            const final = {
              ...publicacao._doc,
              usuario: {
                nome: usuarioDaPublicacao.nome,
                avatar: usuarioDaPublicacao.avatar
              }
            }
            resultado.push(final) // Adiciona o objeto final ao array resultado

            // Esses ... (três pontos) é um recurso do JS para criar um novo Json copiando os dados do Json ja existente
          }
        }

        return res.status(200).json(resultado)
      }
    }
    return res.status(405).json({ erro: 'Método informado não é válido' })
  } catch (e) {
    console.log(e)
    return res.status(400).json({ erro: 'Não foi possível obter o feed' })
  }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(feedEndpoint)))
