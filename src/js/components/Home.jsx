import React, { useEffect, useState } from "react";

const API_URL_BASE = "https://playground.4geeks.com/todo";


const Home = () => {

	const [tarea, setTarea] = useState([]);
	const [inputValue, setInputValue] = useState("");
	const [usuario, setUsuario] = useState("");

	const [tareaSeleccionada, setTareaSeleccionada] = useState(null);

	// Manejar selección de tarea (checkbox)
	const manejarCambioCheckbox = (id, label) => {
		if (tareaSeleccionada === id) {
			setTareaSeleccionada(null);
			setInputValue("");
		} else {
			setTareaSeleccionada(id);
			setInputValue(label); // Cargar texto en el input
		}
	};


	const obtenerUsuariosAll = async () => {
		try {
			const response = await fetch(API_URL_BASE + '/users', { method: "GET" });

			if (!response.ok) {
				throw new Error("Error al obtener Usuarios");
			}

			const data = await response.json();

			if (!data.users || !Array.isArray(data.users)) {
				throw new Error("Estructura de respuesta incorrecta");
			}

			const existeUsuario = data.users.some(x => x.name === "Leonardo4Geeks");

			console.log("Usuarioz: " + usuario);
			if (!existeUsuario) {
				crearUsuario("Leonardo4Geeks");
			} else {
				setUsuario("Leonardo4Geeks");
			}

			console.log("Lista de usuarios:", data.users);
			console.log("¿Leonardo4Geeks existe?", existeUsuario);
			console.log(data);
			console.log("Usuario: " + usuario);

		} catch (error) {
			console.log(error)
		}
	};

	const crearUsuario = async (pUsuario) => {
		try {
			const response = await fetch(`${API_URL_BASE}/users/${pUsuario}`, {
				method: "POST",
				headers: { 'Content-Type': 'application/json' }
			});
			console.log("Usuario: " + response.status);
			if (!response.ok) {
				throw new Error("Error al crear Usuario");
			}

			setUsuario(pUsuario);
		} catch (error) {
			console.log(error);
		}
	};

	const obtenerTareasPorUsuario = async () => {
		try {
			const response = await fetch(API_URL_BASE + '/users/Leonardo4Geeks', { method: "GET" });

			if (!response.ok) {
				throw new Error("Error al consultar las tareas por usuario");
			}

			const data = await response.json();
			console.log(data);
			setTarea(data.todos);

		} catch (error) {
			console.log(error)
		}
	};

	const crearTarea = async () => {
		if (!inputValue.trim()) return;

		try {
			const nuevaTarea = { label: inputValue, is_done: false };

			const response = await fetch(API_URL_BASE + '/todos/Leonardo4Geeks', {
				method: "POST",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(nuevaTarea)
			});

			console.log(response.status);

			if (!response.ok) {
				throw new Error("Error al crear la tarea");
			}
			setInputValue(""); // Limpiar input después de agregar tarea
			obtenerTareasPorUsuario();

		} catch (error) {
			console.log(error);
		}
	};

	const eliminarTarea = async (todo_id) => {
		try {
			const response = await fetch(`${API_URL_BASE}/todos/${todo_id}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				throw new Error(`Error al eliminar la tarea id: ${todo_id}`);
			}

			obtenerTareasPorUsuario();
		} catch (error) {
			console.log(error)
		}
	};

	const actualizarTarea = async () => {
		if (!inputValue.trim() || !tareaSeleccionada) return;

		try {
			const nuevaTarea = { label: inputValue, is_done: false };

			const response = await fetch(`${API_URL_BASE}/todos/${tareaSeleccionada}`, {
				method: "PUT",
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(nuevaTarea)
			});

			console.log(response.status);

			if (!response.ok) {
				throw new Error("Error al crear la tarea");
			}
			setInputValue(""); // Limpiar input después de agregar tarea
			setTareaSeleccionada(null);
			obtenerTareasPorUsuario();

		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		obtenerUsuariosAll();
		obtenerTareasPorUsuario();
	}, []);


	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col">
					<h2>Lista de Tareas:</h2>
					<input type="text" className="form-control" placeholder="Escribe tu tarea y presiona Enter... || Selecciona el item a Actualizar y Presiona Enter"
						onChange={(event) => { setInputValue(event.target.value) }}
						onKeyDown={(event) => {
							if (event.key == "Enter") {
								tareaSeleccionada ? actualizarTarea() : crearTarea();
							}
						}}
						value={inputValue}  // Ahora el input siempre refleja el estado actualizado
					/>
				</div>
			</div>

			<div className="row mt-2">
				<div className="col">
					<ul className="list-unstyled">
						{tarea.map((todo, index) => {
							return (
								<div key={todo.id} className="d-flex justify-content-between align-items-center">
									<li >{todo.label}</li>
									<div>
										<input className="form-check-input mb-0"
											type="checkbox"
											checked={tareaSeleccionada === todo.id}
											onChange={() => manejarCambioCheckbox(todo.id, todo.label)}
										/>
										<i className="fas fa-trash-alt ms-2"
											style={{ cursor: "pointer" }}
											onClick={() => { eliminarTarea(todo.id); }} ></i>
									</div>
								</div>
							)
						})}
					</ul>
				</div>
			</div>

		</div>
	);
};

export default Home;