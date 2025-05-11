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

        { email:'andre@fatec.sp.gov.br', nome: 'Andre Yu Iha', teams: 'andre@fatec.sp.gov.br', //1
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 9, ra: '1050482223032' }, 

        { email:'douglas@fatec.sp.gov.br', nome: 'Douglas dos Santos Fonte', teams: 'douglas@fatec.sp.gov.br', //2
            curso: opcoesCursos.gstE, tipo:'Monitor', idFoto: 2, ra: '1050482223033'  },

        { email:'matheus@fatec.sp.gov.br', nome: 'Matheus Fernando de Oliveira', teams: 'matheus@fatec.sp.gov.br', //3
            curso: opcoesCursos.ads, tipo:'Monitor', idFoto: 3, ra: '1050482223034' },

        { email:'reginaldo@fatec.sp.gov.br', nome: 'Reginaldo Serafim Junior', teams: 'reginaldo@fatec.sp.gov.br', //4
            curso: opcoesCursos.vazio, tipo:'Monitor', idFoto: 11, ra: '1050482223038' },

        { email:'giu@fatec.sp.gov.br', nome: 'Giulia Rodrigues', teams: 'giu@fatec.sp.gov.br', //5
            curso: opcoesCursos.comex, tipo: 'Aluno', idFoto: 8, ra: '1050482223039' },

        { email:'marcos@fatec.sp.gov.br', nome: 'Marcos Roberto', teams: 'marcos@fatec.sp.gov.br', //5
            curso: opcoesCursos.comex, tipo: 'Monitor', idFoto: 9, ra: '1050482223039' }
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
      const andre = await Usuario.findOneBy({nome: "Andre Yu Iha"})
      const douglas = await Usuario.findOneBy({nome: "Douglas dos Santos Fonte"})
      const mateus = await Usuario.findOneBy({nome: "Matheus Fernando de Oliveira"})
      const reginaldo = await Usuario.findOneBy({nome: "Reginaldo Serafim Junior"})

    // Cadastro das materias
    const materias = [
        { nome: 'Contabilidade (Tarde)', idFoto: 1 }, //1
        { nome: 'Informática (Matutino)', idFoto: 5 }, //2
        { nome: 'Inglês', idFoto: 2 }, //3
        { nome: 'Simulação', idFoto: 3 } //4
    ]

    await Promise.all(materias.map(async (dados) => { 
        const materia = new Materia()
        materia.nome = dados.nome
        materia.idFoto = dados.idFoto ? dados.idFoto : 1
        await materia.save() 
      }))

    const cont = await Materia.findOneBy({nome: 'Contabilidade (Tarde)', idFoto: 1})
    const info = await Materia.findOneBy({nome: 'Informática (Matutino)', idFoto: 5})
    const ingles = await Materia.findOneBy({nome: 'Inglês', idFoto: 2})
    const simu = await Materia.findOneBy({nome: 'Simulação', idFoto: 3})

    //Cadastro dos locais
    const locais = [
        { numero: 10, tipo: TipoLocal.sala }, //1
        { numero: 14, tipo: TipoLocal.sala }, //2
        { numero: 15, tipo: TipoLocal.sala }, //3

        { numero: 3, tipo: TipoLocal.lab }, //4
        { numero: 6, tipo: TipoLocal.lab }, //5
        { numero: 11, tipo: TipoLocal.lab }, //6
        { numero: 13, tipo: TipoLocal.lab }, //7

        { tipo: TipoLocal.biblio }, //8
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
    const local4  = await Local.findOneBy({id: 4})
    const local5  = await Local.findOneBy({id: 5})
    const local6  = await Local.findOneBy({id: 6})
    const local7  = await Local.findOneBy({id: 7})
    const local8  = await Local.findOneBy({id: 8})

    //Cadastro das monitorias
    const monitorias = [
        { dia_semana: 'Segunda-feira', horario_inicio: '18:30', horario_fim: '19:30', //1
        usuario: andre, materia: cont, local: local8
        },
        { dia_semana: 'Segunda-feira', horario_inicio: '12:00', horario_fim: '14:00', //2
        usuario: douglas, materia: info, local: local5
        },
        { dia_semana: 'Segunda-feira', horario_inicio: '11:10', horario_fim: '13:10', //3
        usuario: mateus, materia: ingles, local: local2
        },
        { dia_semana: 'Terça-feira', horario_inicio: '12:30', horario_fim: '13:30', //4
        usuario: reginaldo, materia: simu, local: local1
        },
        { dia_semana: 'Terça-feira', horario_inicio: '18:30', horario_fim: '19:30', //4
        usuario: reginaldo, materia: simu, local: local8
        },
        { dia_semana: 'Terça-feira', horario_inicio: '07:20', horario_fim: '09:20', //5
        usuario: douglas, materia: info, local: local6
        },
        { dia_semana: 'Terça-feira', horario_inicio: '13:00', horario_fim: '15:00', //5
        usuario: reginaldo, materia: simu, local: local7
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '12:30', horario_fim: '13:30', //5
        usuario: andre, materia: cont, local: local1
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '18:30', horario_fim: '19:30', //5
        usuario: andre, materia: cont, local: local8
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '12:00', horario_fim: '14:40', //5
        usuario: douglas, materia: info, local: local5
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '07:20', horario_fim: '09:20', //5
        usuario: mateus, materia: ingles, local: local3
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '12:30', horario_fim: '13:30', //5
        usuario: andre, materia: cont, local: local1
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '18:30', horario_fim: '19:30', //5
        usuario: andre, materia: cont, local: local8
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '12:00', horario_fim: '14:00', //5
        usuario: douglas, materia: info, local: local5
        },
        { dia_semana: 'Quinta-feira', horario_inicio: '11:10', horario_fim: '13:10', //5
        usuario: mateus, materia: ingles, local: local2
        },
        { dia_semana: 'Quarta-feira', horario_inicio: '11:10', horario_fim: '14:10', //5
        usuario: reginaldo, materia: simu, local: local4
        },
        { dia_semana: 'Sexta-feira', horario_inicio: '18:30', horario_fim: '19:30', //5
        usuario: andre, materia: cont, local: local8
        },
        { dia_semana: 'Sexta-feira', horario_inicio: '11:10', horario_fim: '13:10', //5
        usuario: douglas, materia: info, local: local2
        },
        { dia_semana: 'Sexta-feira', horario_inicio: '11:10', horario_fim: '14:10', //5
        usuario: reginaldo, materia: simu, local: local7
        },
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
        { nome: 'Andre Yu Iha', teamsUser: 'andre_yuIha', teamsEmail: 'andre.yuIha@fatec.sp.gov.br', idFoto: 9, tipo: 'Monitor' },
        { nome: 'Douglas dos Santos Fonte', teamsUser: 'douglas_santos', teamsEmail: 'douglas.santos@fatec.sp.gov.br', idFoto: 2, tipo: 'Monitor'  },
        { nome: 'Matheus Fernando de Oliveira', teamsUser: 'mateus_fernandes83', teamsEmail: 'mateus.fernandes@fatec.sp.gov.br', idFoto: 3, tipo: 'Monitor'  },
        { nome: 'Reginaldo Serafim Junior', teamsUser: 'reginaldo_serafim49', teamsEmail: 'reginaldo.serafim@fatec.sp.gov.br', idFoto: 11, tipo: 'Monitor'  },
        { nome: 'Sérgio Clauss', teamsUser: 'sergio_clauss', teamsEmail: 'sergio.clauss@fatec.sp.gov.br', idFoto: 5, tipo: 'Professor'  },
        { nome: 'Simone Mendes', teamsUser: 'simone_mendes99', teamsEmail: 'simone.mendes@fatec.sp.gov.br', idFoto: 6, tipo: 'Professor'  },
        { nome: 'Alexandre Skupien', teamsUser: 'alexandre_skupien17', teamsEmail: 'alexandre.skupien@fatec.sp.gov.br', idFoto: 7, tipo: 'Professor'  },
        { nome: 'Laura Valentin', teamsUser: 'laura_valentin67', teamsEmail: 'laura.valentin@fatec.sp.gov.br', idFoto: 8, tipo: 'Professor'  },
        { nome: 'Osvaldo de Oliveira', teamsUser: 'osvaldo_oliveira85', teamsEmail: 'osvaldo.oliveira@fatec.sp.gov.br', idFoto: 9, tipo: 'Professor'  }
        
    ]

    await Promise.all(contatos.map(async (dados) => { 
        const contato = new Contato()
        contato.nome = dados.nome
        contato.teamsUser = dados.teamsUser
        contato.teamsEmail = dados.teamsEmail
        contato.idFoto = dados.idFoto ? dados.idFoto : 2
        contato.tipo = dados.tipo
        await contato.save()
     }))
      console.log('Finalizando cadastros...')
    }
    else console.log('Ok!')
}

export default seed
