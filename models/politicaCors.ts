import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import type { RespostaPadraoMsg } from '@/types/RespostaPadraoMsg'
import NextCors from 'nextjs-cors'

export const politicaCORS = (handler: NextApiHandler) => 
  async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
   try {
      await NextCors(req, res, {
        origin: '*',
        method: ['GET', 'POST', 'PUT'],//metodos utilizados nas apis
        optionsSuccessStatus: 200,//tratar os erros de http 204, navegadores antigos dão problemas quando se retorna 204

      })

      return handler(req, res)
    } catch (e) {
      console.log('Erro ao tratar a politica de CORS:', e)
      return res
        .status(500)
        .json({ erro: 'Ocorreu erro ao tratar a politica de CORS' })
    }
  }

