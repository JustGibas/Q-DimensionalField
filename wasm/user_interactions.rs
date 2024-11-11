use std::sync::{Arc, Mutex};
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[derive(Serialize, Deserialize, Clone)]
struct UserInteractionState {
    interaction_type: String,
    data: String,
}

#[wasm_bindgen]
pub struct UserInteractions {
    state: Arc<Mutex<UserInteractionState>>,
}

#[wasm_bindgen]
impl UserInteractions {
    #[wasm_bindgen(constructor)]
    pub fn new() -> UserInteractions {
        let state = UserInteractionState {
            interaction_type: String::from("none"),
            data: String::new(),
        };
        UserInteractions {
            state: Arc::new(Mutex::new(state)),
        }
    }

    pub fn update_interaction(&self, interaction_type: String, data: String) {
        let mut state = self.state.lock().unwrap();
        state.interaction_type = interaction_type;
        state.data = data;
    }

    pub fn get_interaction(&self) -> JsValue {
        let state = self.state.lock().unwrap();
        JsValue::from_serde(&state).unwrap()
    }

    pub fn handle_event(&self, event: JsValue) {
        let event: UserInteractionEvent = event.into_serde().unwrap();
        match event {
            UserInteractionEvent::UpdateInteraction(interaction_type, data) => {
                self.update_interaction(interaction_type, data)
            },
        }
    }
}

#[derive(Serialize, Deserialize)]
enum UserInteractionEvent {
    UpdateInteraction(String, String),
}
