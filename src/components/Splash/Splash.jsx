import { Spinner } from "react-bootstrap";
import logo from "../../assets/images/logo-cadastro.jpg";


export function Splash() {
    return (
                <div className="mt-5 d-flex justify-content-center text-center">
                    <div>
                        <img src={logo} className="rounded" alt="logo"></img>
                        <h1><i><b>Finance</b></i></h1>
                        <h2>Financeiro</h2>
                            <button type="button" className="btn btn-dark mw-11">
                                <Spinner variant="secondary"></Spinner>
                            </button>
                    </div>
                </div>
    );
}