import FadeIn from "@/components/FadeIn";

export const metadata = {
    title: "Política de Privacidade — Lumen AI",
    description: "Política de privacidade e termos de uso do blog Lumen AI.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full flex flex-col pt-10 pb-24 px-6 max-w-3xl mx-auto min-h-[60vh]">
            <FadeIn delay={100} direction="up">
                {/* Header */}
                <div className="mb-12 border-b border-zinc-800 pb-12">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        Política de Privacidade
                    </h1>
                    <p className="text-lg text-zinc-400 font-medium">
                        Última atualização: 26 de fevereiro de 2026
                    </p>
                </div>

                {/* Disclaimer */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-10">
                    <p className="text-sm text-zinc-400 italic">
                        <strong className="text-zinc-300">Disclaimer:</strong> Este documento é um modelo padrão e será revisado e ajustado por profissionais jurídicos. Use como referência, não como aconselhamento legal.
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-invert max-w-none text-zinc-400 prose-headings:font-serif prose-headings:text-white prose-a:text-tribune-accent">

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">1. Introdução</h2>
                    <p>
                        A <strong>Lumen AI</strong> (&quot;nós&quot;, &quot;nosso&quot;) se compromete a proteger a privacidade dos visitantes do nosso blog. Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)</strong>.
                    </p>
                    <p>
                        Ao acessar e utilizar o site, você concorda com as práticas descritas nesta política. Caso não concorde, solicitamos que não continue a utilização do site.
                    </p>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">2. Dados que Coletamos</h2>
                    <p>Podemos coletar os seguintes tipos de informações:</p>
                    <ul>
                        <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, sistema operacional, páginas acessadas, tempo de permanência e dados de cookies estritamente necessários.</li>
                        <li><strong>Dados fornecidos voluntariamente:</strong> nome e email, caso o usuário opte por entrar em contato conosco através do formulário de contato.</li>
                        <li><strong>Dados de analytics:</strong> utilizamos ferramentas de análise para compreender o comportamento agregado dos visitantes, sempre de forma anônima quando possível.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">3. Finalidade do Tratamento</h2>
                    <p>Os dados coletados são utilizados exclusivamente para:</p>
                    <ul>
                        <li>Melhorar a experiência de navegação e a qualidade do conteúdo.</li>
                        <li>Gerar estatísticas anônimas de acesso (ex: contagem de visualizações por artigo).</li>
                        <li>Responder a solicitações enviadas via formulário de contato.</li>
                        <li>Garantir a segurança e o funcionamento adequado do site.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">4. Compartilhamento de Dados</h2>
                    <p>
                        A Lumen AI <strong>não vende, aluga ou compartilha</strong> dados pessoais dos visitantes com terceiros para fins comerciais. Os dados podem ser compartilhados apenas com:
                    </p>
                    <ul>
                        <li><strong>Provedores de infraestrutura</strong> (Vercel, Supabase) para hospedagem e funcionamento do site.</li>
                        <li><strong>Autoridades competentes</strong>, mediante ordem judicial ou obrigação legal.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">5. Cookies</h2>
                    <p>
                        Utilizamos cookies estritamente necessários para o funcionamento do site. Não utilizamos cookies de rastreamento ou publicidade. Você pode configurar seu navegador para recusar cookies, embora isso possa afetar a funcionalidade de algumas páginas.
                    </p>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">6. Seus Direitos (LGPD)</h2>
                    <p>
                        Conforme a LGPD, você tem o direito de:
                    </p>
                    <ul>
                        <li>Solicitar acesso aos seus dados pessoais.</li>
                        <li>Solicitar a correção de dados incompletos ou inexatos.</li>
                        <li>Solicitar a exclusão dos seus dados pessoais.</li>
                        <li>Revogar o consentimento para o tratamento dos seus dados.</li>
                        <li>Solicitar a portabilidade dos seus dados.</li>
                    </ul>
                    <p>
                        Para exercer qualquer desses direitos, entre em contato pelo email abaixo.
                    </p>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">7. Retenção de Dados</h2>
                    <p>
                        Os dados pessoais são mantidos apenas pelo tempo necessário para cumprir as finalidades descritas nesta política. Dados de navegação anônimos podem ser mantidos indefinidamente para fins estatísticos.
                    </p>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">8. Contato</h2>
                    <p>
                        Para dúvidas, solicitações ou reclamações relacionadas a esta Política de Privacidade, entre em contato conosco pelo email: <a href="mailto:contato@lumenai.blog">contato@lumenai.blog</a>
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}
