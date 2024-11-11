use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[derive(Serialize, Deserialize, Clone)]
struct AIState {
    behavior: String,
}

#[wasm_bindgen]
pub struct AI {
    state: Arc<Mutex<AIState>>,
}

#[wasm_bindgen]
impl AI {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AI {
        let state = AIState {
            behavior: String::from("idle"),
        };
        AI {
            state: Arc::new(Mutex::new(state)),
        }
    }

    pub fn update_behavior(&self, new_behavior: String) {
        let mut state = self.state.lock().unwrap();
        state.behavior = new_behavior;
    }

    pub fn get_behavior(&self) -> JsValue {
        let state = self.state.lock().unwrap();
        JsValue::from_serde(&state.behavior).unwrap()
    }

    pub fn handle_event(&self, event: JsValue) {
        let event: AIEvent = event.into_serde().unwrap();
        match event {
            AIEvent::UpdateBehavior(new_behavior) => self.update_behavior(new_behavior),
        }
    }
}

#[derive(Serialize, Deserialize)]
enum AIEvent {
    UpdateBehavior(String),
}
