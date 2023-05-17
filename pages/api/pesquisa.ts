import type { NextApiRequest, NextApiResponse } from 'next'
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'

const pesquisaEndpoint = async (
  req: NextApiRequest,
  res: NextApiResponse<RespostaPadraoMsg | any[]>
) => {
  try {
    if (req.method === 'GET') {
      //valida se o metodo da requisição é ou nao Get(usado para trazer dados)
      const { filtro } = req.query
      if (!filtro || filtro.length < 2) {
        //valida se a busca tem no minimo dois caracteres
        return res
          .status(400)
          .json({ erro: 'Favor informar pelo menos 2 caracteres para a busca' })
      }
      const usuariosEncontrados = await UsuarioModel.find({
        $or: [
          { nome: { $regex: filtro, $options: 'i' } }
          //{ email: { $regex:filtro, $options: 'i' } }
          /*  $regex é um operador que permite fazer correspondência de padrões usando expressões regulares.
              filtro é a variável que contém o padrão a ser pesquisado.
              $options: 'i' é uma opção que torna a busca case-insensitive, ou seja, não diferencia maiúsculas de minúsculas.
          */
        ]
      })

      return res.status(200).json(usuariosEncontrados)
    }
    return res.status(405).json({ erro: 'metodo informado nao e valido' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ erro: 'nao foi posssivel buscar usuarios' })
  }
}

export default validarTokenJWT(conectarMongoDB(pesquisaEndpoint))
