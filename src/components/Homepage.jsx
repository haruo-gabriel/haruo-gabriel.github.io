// Homepage Component
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../translations/translations";

// Project Square Subcomponent
function ProjectSquare({ src, alt, projectName }) {
	return (
		<div className="relative group cursor-pointer overflow-hidden">
			<img
				src={src}
				alt={alt}
				className="w-full h-auto transition-all duration-300 group-hover:blur-md"
			/>
			<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
				<p className="text-white text-xl bg-black bg-opacity-50 px-4 py-2">
					{projectName}
				</p>
			</div>
		</div>
	);
}

function Homepage() {
	const { language } = useLanguage();

	return (
		<div className="flex flex-col max-w-4xl w-full space-y-8">
			{/* formalidades */}
			<div className="flex flex-col space-y-4 px-8">
				<h2 className="text-black text-4xl font-medium text-right">
					formalidades
				</h2>
				<p>
					<span className="font-normal">
						Universidade de São Paulo, Instituto de Matemática e Estatística
					</span>{" "}
					- Bach. em Ciência da Computação (em andamento)
				</p>
				<p>
					Interesse em{" "}
					<span className="font-normal">
						Processamento Digital de Sinais para Áudio e Imagem
					</span>
					, <span className="font-normal">Computação Musical</span>,{" "}
					<span className="font-normal">Computação Gráfica</span>,{" "}
					<span className="font-normal">
						Sistemas Embarcados para aplicações em áudio
					</span>
					, <span className="font-normal">Arte & Tecnologia.</span>
				</p>
				<p>
					Pesquisa no desenvolvimento do{" "}
					<a
						href="https://github.com/haruo-gabriel/vorpal/tree/update-libpd-version"
						target="_blank"
						rel="noopener noreferrer"
						className="link-styled"
					>
						VORPAL: um middleware de áudio focado em trilhas sonoras procedurais
						em tempo real para jogos
					</a>
					.
				</p>
				<p>
					Participação no{" "}
					<a
						href="https://compmus.ime.usp.br/pt-br/"
						target="_blank"
						rel="noopener noreferrer"
						className="link-styled"
					>
						grupo de pesquisa em Computação Musical do IME-USP (CompMus IME-USP)
					</a>
					,{" "}
					<a
						href="https://github.com/uspaudiotech/"
						target="_blank"
						rel="noopener noreferrer"
						className="link-styled"
					>
						grupo de extensão USPAudioTech
					</a>{" "}
					e{" "}
					<a
						href="https://github.com/gpi-nusom"
						target="_blank"
						rel="noopener noreferrer"
						className="link-styled"
					>
						Grupo de Práticas Interativas do NuSom (GPI)
					</a>
					.
				</p>
			</div>
			{/* não-formalidades */}
			<div className="flex flex-col space-y-4 px-8">
				<h2 className="text-black text-4xl font-medium text-right">
					não-formalidades
				</h2>
				<p>
					Fora do acadêmico, costumo me divertir aprendendo sobre assuntos
					diversos. Na maior parte, bem mais que meu próprio campo de estudo.
					Alguns dos tópicos incluem:
				</p>
				<ul className="list-disc list-inside space-y-1 font-['Roboto_Mono'] font-light text-sm">
					<li>composição musical</li>
					<li>produção musical</li>
					<li>performance musical</li>
					<li>engenharia de som</li>
					<li>pedais de guitarra</li>
					<li>sintetizadores</li>
					<li>realmente ouvir música</li>
					<li>
						desenvolvimento de jogos (ironicamente e infelizmente, não tenho
						mais tanta paciência para jogar videogames)
					</li>
					<li>arquitetura</li>
					<li>design de produto</li>
					<li>design gráfico</li>
					<li>edição de fotos</li>
					<li>edição de vídeos</li>
					<li>interfaces humano-computador</li>
					<li>uma pequena dose de filosofia, linguagem e comunicação</li>
				</ul>
			</div>
			{/* projetos */}
			<div className="flex flex-col space-y-4 px-8">
				<h2 className="text-black text-4xl font-medium text-right">projetos</h2>
				<p>
					A vida só pode ser tolerada ao mergulhar no ciclo vicioso de absorver
					e criar. Aqui está um pequeno panorama dos meus projetos:
				</p>
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
					<ProjectSquare
						src="/a_deriva-capa.png"
						alt="À Deriva - Capa"
						projectName="À Deriva"
					/>
					<ProjectSquare
						src="/imensidão-capa.png"
						alt="Imensidão - Capa"
						projectName="Imensidão Pt. 1"
					/>
					<ProjectSquare
						src="/menis_mangione_mfx-capa.png"
						alt="Menis Mangione MFX"
						projectName="Menis Mangione MFX"
					/>
					{/* Exception: procedurally generated project */}
					<div className="relative group cursor-pointer overflow-hidden flex justify-center items-center bg-moso-black w-full aspect-square">
						<p className="text-white text-center transition-all duration-300 group-hover:blur-sm">
							Este website.
						</p>
						<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<p className="text-white text-xl bg-black bg-opacity-50 px-4 py-2">
								Portfolio
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Homepage;
