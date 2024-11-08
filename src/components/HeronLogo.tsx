import logo from '@/assets/heron-logo.png';
export default function HeronLogo() {
	return (
		<a href="https://herondata.io" target="_blank" rel="noreferrer">
			<img src={logo} alt="Heron Logo" className="h-12" />
		</a>
	);
}
