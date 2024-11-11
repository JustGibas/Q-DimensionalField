use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[derive(Serialize, Deserialize, Clone)]
struct PhysicsState {
    position: (f32, f32, f32),
    velocity: (f32, f32, f32),
}

#[wasm_bindgen]
pub struct Physics {
    state: Arc<Mutex<PhysicsState>>,
}

#[wasm_bindgen]
impl Physics {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Physics {
        let state = PhysicsState {
            position: (0.0, 0.0, 0.0),
            velocity: (0.0, 0.0, 0.0),
        };
        Physics {
            state: Arc::new(Mutex::new(state)),
        }
    }

    pub fn update(&self, dt: f32) {
        let mut state = self.state.lock().unwrap();
        state.position.0 += state.velocity.0 * dt;
        state.position.1 += state.velocity.1 * dt;
        state.position.2 += state.velocity.2 * dt;
    }

    pub fn set_velocity(&self, vx: f32, vy: f32, vz: f32) {
        let mut state = self.state.lock().unwrap();
        state.velocity = (vx, vy, vz);
    }

    pub fn get_position(&self) -> JsValue {
        let state = self.state.lock().unwrap();
        JsValue::from_serde(&state.position).unwrap()
    }

    pub fn handle_event(&self, event: JsValue) {
        let event: PhysicsEvent = event.into_serde().unwrap();
        match event {
            PhysicsEvent::SetVelocity(vx, vy, vz) => self.set_velocity(vx, vy, vz),
        }
    }
}

#[derive(Serialize, Deserialize)]
enum PhysicsEvent {
    SetVelocity(f32, f32, f32),
}
