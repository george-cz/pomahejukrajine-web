import {FormEvent, useCallback, useState} from "react";

interface VerifyState {
	password: string;
	passwordSecond: string;
}

export const VerifyForm = () => {
	const [submitting, setSubmitting] = useState<false | 'notSame' | 'submitting' | 'success' | 'error'>(false);
	const [error, setError] = useState<string | null>(null);
	const [state, setState] = useState<VerifyState>({
		password: "",
		passwordSecond: ""
	});

	const submit = useCallback(async (e: FormEvent) => {
		e.preventDefault()
		setSubmitting('submitting')

		if (state.password !== state.passwordSecond) {
			setSubmitting('notSame')
			return
		}

		const urlSearchParams = new URLSearchParams(window.location.search);

		const response = await fetch("/api/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				password: state.password,
				secretCode: urlSearchParams.get("secretCode"),
				id: urlSearchParams.get("id"),
			})
		});

		if (response.ok) {
			setSubmitting('success')
		} else {
			let message = 'Chyba při odesílání formuláře'
			try {
				const json = await response.json()
				if (typeof json.error === 'string') {
					message = json.error
				}
			} catch (e) {}
			setError(message)
			setSubmitting('error')
		}
	}, [state]);


	if (submitting === 'success') {
		return (
			<div className="p-2 rounded-lg bg-indigo-600 shadow-lg sm:p-3 text-center text-lg">
				<p className="mx-3 font-medium text-white">Heslo nastaveno. Vaše nabídka byla uložena. V nejbližší době Vaši nabídku zpracujeme a ozveme se Vám pro případná upřesnění nebo jakmile bude Vaše pomoc potřeba.</p>
			</div>
		)
	}

	const disabled = submitting === 'submitting'

	return (
		<form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" onSubmit={submit}>
			{submitting === 'notSame' && <p className="p-2 rounded-lg bg-red-500 shadow-lg text-center text-white mx-auto px-8">Hesla se neshodují</p>}
			{submitting === 'error' && <p className="p-2 rounded-lg bg-red-500 shadow-lg text-center text-white mx-auto px-8">Nastala chyba</p>}
			{error && <p className="p-2 rounded-lg bg-red-500 shadow-lg text-center text-white mx-auto px-8">{error}</p>}
			<div>
				<label htmlFor="password" className="block text-sm font-medium text-gray-700">
					Heslo:
				</label>
				<div className="mt-1">
					<input
						disabled={disabled}
						type="password"
						id="password"
						required
						value={state.password}
						onChange={(e) => setState({ ...state, password: e.target.value })}
						className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
					/>
				</div>
			</div>
			<div>
				<label htmlFor="passwordSecond" className="block text-sm font-medium text-gray-700">
					Heslo pro kontrolu:
				</label>
				<div className="mt-1">
					<input
						disabled={disabled}
						type="password"
						id="passwordSecond"
						required
						value={state.passwordSecond}
						onChange={(e) => setState({ ...state, passwordSecond: e.target.value })}
						className="py-3 px-4 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
					/>
				</div>
			</div>
			<button disabled={disabled} type="submit" className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Nastavit</button>
		</form>
	);
}
