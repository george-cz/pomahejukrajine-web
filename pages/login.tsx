import type { GetServerSidePropsContext, NextPage } from "next"
import { Meta } from "../components/Meta"
import Header from "../components/header"
import Footer from "../components/footer"
import { LoginForm } from "../components/LoginForm"

const Login: NextPage = () => {
	return (
		<div className="antialiased text-gray-600">
			<Meta title="Pomoc Ukrajině" description="Pomoc Ukrajině" noIndex />
			<Header />
			<div className="bg-white py-4 px-4 overflow-hidden sm:px-6 lg:px-8 lg:py-8">
				<div className="relative max-w-xl mx-auto">
					<main className="mt-2">
						<div className="text-center">
							<h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Přihlásit se</h2>
						</div>
						<div className="mt-12">
							<LoginForm />
						</div>
					</main>
				</div>
			</div>
			<Footer />
		</div>
	)

}

export default Login

export async function getServerSideProps(context: GetServerSidePropsContext) {
	if (context.req.cookies.token) {
		return {
			redirect: {
				permanent: false,
				destination: "/moje-nabidky"
			}
		}
	} else {
		return {
			props: {}
		}
	}
}
