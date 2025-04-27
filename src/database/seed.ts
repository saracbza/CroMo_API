import Agenda from "../models/Agenda"
import Contato from "../models/Contato"
import Local from "../models/Local"
import Materia from "../models/Materia"
import Monitoria from "../models/Monitoria"
import Usuario from "../models/Usuario"
import { opcoesCursos, TipoLocal } from "../utils/validacoes"

async function seed() {
    const cadastrar = false

    if (cadastrar){
    console.log('Iniciando cadastros...')

    // Cadastro dos usuários
    const usuarios = [
        { email:'teste@email.com', nome: 'Teste Gonçalves', teams: 'teste@email.com', //1
            curso: opcoesCursos.ads, tipo:'Aluno', idFoto: 2, ra: '1050482223031' },

        { email:'jose@fatec.sp.gov.br', nome: 'Jose Alves', teams: 'jose@fatec.sp.gov.br', //1
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 3, ra: '1050482223032' }, 

        { email:'abner@fatec.sp.gov.br', nome: 'Abner Fernandes', teams: 'abner@fatec.sp.gov.br', //2
            curso: opcoesCursos.gstE, tipo:'Aluno', idFoto: 3, ra: '1050482223033'  },

        { email:'rafaela@fatec.sp.gov.br', nome: 'Rafaela Gomes', teams: 'rafaela@fatec.sp.gov.br', //3
            curso: opcoesCursos.ads, tipo:'Aluno', ra: '1050482223034' },

        { email:'marcos@fatec.sp.gov.br', nome: 'Marcos Roberto', teams: 'marcos@fatec.sp.gov.br', //4
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 4, ra: '1050482223038' },

        { email:'giu@fatec.sp.gov.br', nome: 'Giulia Rodrigues', teams: 'giu@fatec.sp.gov.br', //5
            curso: opcoesCursos.comex, tipo: 'Aluno', idFoto: 2, ra: '1050482223039' }
    ]

    await Promise.all(usuarios.map(async (dados) => { 
        const usuario = new Usuario()
        usuario.email = dados.email
        usuario.nome = dados.nome
        usuario.tipo = dados.tipo
        usuario.curso = dados.curso
        usuario.teams = dados.teams
        usuario.ra = dados.ra
        usuario.idFoto = dados.idFoto ? dados.idFoto : 1
        await usuario.save() 
      }))

      const teste = await Usuario.findOneBy({nome: "Teste Gonçalves"})
      const jose = await Usuario.findOneBy({nome: "Jose Alves"})
      const marcos = await Usuario.findOneBy({nome: "Marcos Roberto"})

    // Cadastro das materias
    const materias = [
        { nome: 'Informática', idFoto: 1 }, //1
        { nome: 'Contabilidade', idFoto: 5 } //2
    ]

    await Promise.all(materias.map(async (dados) => { 
        const materia = new Materia()
        materia.nome = dados.nome
        materia.idFoto = dados.idFoto ? dados.idFoto : 1
        await materia.save() 
      }))

    const info = await Materia.findOneBy({nome: 'Informática'})
    const cont = await Materia.findOneBy({nome: 'Contabilidade'})

    //Cadastro dos locais
    const locais = [
        { numero: 5, tipo: TipoLocal.sala }, //1
        { tipo: TipoLocal.biblio }, //2
        { numero: 2, tipo: TipoLocal.lab } //3
    ]

    await Promise.all(locais.map(async (dados) => { 
        const local = new Local()
        local.numero = dados.numero
        local.tipo = dados.tipo
        await local.save() 
      }))

    const local1 = await Local.findOneBy({id: 1})
    const local2 = await Local.findOneBy({id: 2})
    const local3  = await Local.findOneBy({id: 3})

    //Cadastro das monitorias
    const monitorias = [
        { dia_semana: 'Segunda-feira', horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: jose, materia: info, local: local1
        },
        { dia_semana: 'Segunda-feira', horario_inicio: '15:00', horario_fim: '18:30', //2
        usuario: marcos, materia: info, local: local1
        },
        { dia_semana: 'Terça-feira', horario_inicio: '09:30', horario_fim: '10:30', //3
        usuario: marcos, materia: cont, local: local1
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '09:30', horario_fim: '10:30', //4
        usuario: jose, materia: info, local: local2
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '17:30', horario_fim: '18:00', //5
        usuario: marcos, materia: cont, local: local3
        }
    ]
    await Promise.all(monitorias.map(async (dados) => { 
        if (dados.usuario && dados.materia && dados.local){
        const monitoria = new Monitoria()
        monitoria.dia_semana = dados.dia_semana
        monitoria.horario_inicio = dados.horario_inicio
        monitoria.horario_fim = dados.horario_fim
        monitoria.usuario = dados.usuario
        monitoria.materia = dados.materia
        monitoria.local = dados.local
        await monitoria.save() 
     }
      }))

    //Cadastro de agendas
    const agendas = [
        { nomeMateria: 'Estatística', dia_semana: "Segunda-feira", horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: teste, local: local1 
        },
        { nomeMateria: 'Gestão de Equipes', dia_semana: "Segunda-feira", horario_inicio: '09:30', horario_fim: '10:30', //1
            usuario: teste, local: local2 
        },
        { nomeMateria: 'Gestão de Equipes', dia_semana: "Quinta-feira", horario_inicio: '09:30', horario_fim: '10:30', //1
                usuario: teste, local: local2
        }
    ]

    await Promise.all(agendas.map(async (dados) => { 
        if (dados.usuario && dados.local){
        const agenda = new Agenda()
        agenda.dia_semana = dados.dia_semana
        agenda.horario_inicio = dados.horario_inicio
        agenda.horario_fim = dados.horario_fim
        agenda.usuario = dados.usuario
        agenda.nome_materia = dados.nomeMateria
        agenda.local = dados.local
        await agenda.save()
    }
     }))

     //Cadastro de Contatos
    const contatos = [
        { nome: 'Adilson Rodrigues', teamsUser: 'adilson_rodrigues14', teamsEmail: 'adilson.rodrigues@fatec.sp.gov.br', idFoto: 2 },
        { nome: 'Acelino Freitas', teamsUser: 'acelino_freitas27', teamsEmail: 'acelino.freitas@fatec.sp.gov.br', idFoto: 1 },
        { nome: 'John Jones', teamsUser: 'john_jones83', teamsEmail: 'john.jones@fatec.sp.gov.br', idFoto: 3 },
        { nome: 'Roberta Lima', teamsUser: 'roberta_lima49', teamsEmail: 'roberta.lima@fatec.sp.gov.br', idFoto: 5 },
        { nome: 'Renato Gomes', teamsUser: 'renato_gomes42', teamsEmail: 'renato.gomes@fatec.sp.gov.br', idFoto: 4 },
        { nome: 'Mariana Makashev', teamsUser: 'mariana_makashev91', teamsEmail: 'mariana.makashev@fatec.sp.gov.br', idFoto: 2 },
        { nome: 'Khabib Nurmagumedov', teamsUser: 'khabib_nurmagumedov13', teamsEmail: 'khabib.nurmagumedov@fatec.sp.gov.br', idFoto: 1 },
        { nome: 'Laura Valentin', teamsUser: 'laura_valentin67', teamsEmail: 'laura.valentin@fatec.sp.gov.br', idFoto: 1 },
        { nome: 'Osvaldo de Oliveira', teamsUser: 'osvaldo_oliveira85', teamsEmail: 'osvaldo.oliveira@fatec.sp.gov.br', idFoto: 5 }
        
    ]

    await Promise.all(contatos.map(async (dados) => { 
        const contato = new Contato()
        contato.nome = dados.nome
        contato.teamsUser = dados.teamsUser
        contato.teamsEmail = dados.teamsEmail
        contato.idFoto = dados.idFoto ? dados.idFoto : 2
        await contato.save()
     }))
      console.log('Finalizando cadastros...')
    }
    else console.log('Ok!')
}

export default seed