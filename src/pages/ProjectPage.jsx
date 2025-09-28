import { useParams, Link } from "react-router-dom";

// Project data structure
const projectsData = {
	"imensidao-pt-1": {
		title: "Imensidão Pt. 1",
		image: "/imensidão-capa.png",
		content: (
			<>
				<p>
					<strong className="italic">Imensidão Pt. 1</strong> é um álbum com
					duas músicas, sendo a primeira parte de um projeto maior. O trabalho
					une uma trilha sonora espacial a uma história escrita, cujo estilo
					lembra um roteiro de filme. Cada música está associada a um capítulo
					escrito.
				</p>
				<p>Clique nos títulos das músicas abaixo para acessar os textos:</p>
				<h2 className="section-subtitle">Tracklist</h2>
				<ol className="list-decimal list-inside">
					<li>
						<a href="#" className="link-styled">
							Encontro/Pouso
						</a>
					</li>
					<li>
						<a href="#" className="link-styled">
							Vislumbre
						</a>
					</li>
				</ol>
			</>
		),
	},
	"a-deriva": {
		title: "à deriva",
		image: "/a_deriva-capa.png",
		content: (
			<>
				<p>
					<strong className="italic">à deriva</strong> é um álbum que mescla a
					natureza simples e delicada do violão de nylon com técnicas digitais
					de processamento de som ásperas e cheias de glitches. O resultado é
					uma estética sonora lenta e intimista, mas possivelmente estranha,
					desconfortável e inquietante.
				</p>
				<p>
					Capa feita por Giovanna Leonardi (
					<a
						href="https://www.instagram.com/gigileonardi/"
						target="_blank"
						rel="noopener noreferrer"
						className="link-styled"
					>
						instagram: @gigileonardi
					</a>
					)
				</p>
				<h2 className="section-subtitle">Tracklist</h2>
				<ol className="list-decimal list-inside">
					<li>à deriva</li>
					<li>todas as flores secam no outono</li>
				</ol>
			</>
		),
	},
	"menis-mangione-mfx": {
		title: "Mangione MFX",
		image: "/menis_mangione_mfx-capa.png",
		content: (
			<>
				<p>
					O <strong className="italic">Menis Mangione MFX</strong> é um pedal de
					guitarra digital multi-efeitos feito em colaboração com o Vinícius
					Fernandes da Menis (instagram:{" "}
					<a
						href="https://www.instagram.com/menis______/"
						target="_blank"
						rel="noopener noreferrer"
						className="link-styled"
					>
						@menis______
					</a>
					). A unidade inclui:
				</p>
				<ul className="list-disc list-inside mb-2 ml-2">
					<li className="italic">Distorção baseada em wavefolding</li>
					<li className="italic">Redutor de taxa de amostragem</li>
					<li className="italic">Delay com LFO senoidal no tempo de delay</li>
				</ul>
				<p>
					Essa foi a minha primeira experiência desenvolvendo um pedal de
					guitarra. Sempre tive o desejo de montar meus próprios pedais, mas
					nunca fui fã de eletrônica (essa foi uma das principais razões na qual
					acabei escolhendo ciência da computação ao invés de engenharia da
					computação). Quando o Vinícius me perguntou se eu queria aprender a
					fazer pedais ajudando-o a escrever o código em C++ do Mangione, decidi
					que finalmente aprenderia o básico de eletrônica. E foi muito mais
					fácil do que eu pensava, pois acabou não sendo necessário elaborar
					circuitos complicados. Fazíamos tudo digitalmente com um{" "}
					<em>daisy seed</em>, e o conhecimento de eletrônica necessário era
					simples: conectar potenciômetros, LED’s e jacks de áudio em uns pinos
					no <i>daisy</i>. O resto era escrever código e resgatar os
					conhecimentos de processamento digital de sinais, áreas no qual eu
					estava muito mais confortável em aplicar.
				</p>
				<p>
					Esse projeto tem um valor imensurável para mim. Foi a primeira vez
					confeccionando um produto real, algo que eu poderia tocar. Não era
					apenas software, mas uma caixinha de metal que faz o som da minha
					guitarra se transformar em uma entidade monstruosa. Quando me dei
					conta de que, com a ajuda de alguns amigos, eu poderia construir um
					objeto que sempre amei e desejei morbidamente desde criança, foi forte
					demais para ignorar. Desde então, estou sempre com pelo menos um
					projeto desse estilo em andamento, e todo dia sonho em viver de
					construir essas pequenas máquinas.
				</p>
			</>
		),
	},
	"portfolio": {
		title: "Este website.",
		image: "/portfolio-capa.png",
		content: (
			<>
				<p>
					<strong className="italic">Este website</strong> é meu portfolio
					digital. Sempre adorei a ideia de ter um lugar meu na internet, um em
					que cada detalhe foi minuciosamente pensado e baseado no meu próprio
					gosto. É como ter um quarto na web, mas não custa nada para decorá-lo.
					Todo mundo gosta de deixar o próprio quarto com uma cara autêntica.
				</p>
			</>
		),
	},
};

function ProjectPage() {
	// Get the project ID from the URL
	const { projectId } = useParams();
	const project = projectsData[projectId];

	// Handle case where project doesn't exist
	if (!project) {
		return (
			<div className="flex flex-col w-full space-y-8">
				<h1 className="section-title">Projeto não encontrado</h1>
				<Link to="/" className="link-styled">
					← Voltar para home
				</Link>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full space-y-8">
			<div className="flex flex-row items-center justify-between gap-4">
				{/* Back navigation */}
				<Link to="/" className="link-styled self-center">
					← Voltar
				</Link>

				{/* Project title */}
				<h1 className="section-title">{project.title}</h1>
			</div>
			<div className="flex justify-center">
				<img
					src={project.image}
					alt={project.title}
					className="max-w-md w-full h-auto"
				/>
			</div>
			{/* Project content - completely flexible */}
			<div className="prose max-w-none">{project.content}</div>
		</div>
	);
}

export default ProjectPage;
