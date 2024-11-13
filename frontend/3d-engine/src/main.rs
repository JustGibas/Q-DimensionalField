use yew::prelude::*;

struct ThreeDEngine;

impl Component for ThreeDEngine {
    type Message = ();
    type Properties = ();

    fn create(ctx: &Context<Self>) -> Self {
        Self
    }

    fn update(&mut self, ctx: &Context<Self>, msg: Self::Message) -> bool {
        false
    }

    fn change(&mut self, ctx: &Context<Self>, _: Self::Properties) -> bool {
        false
    }

    fn view(&self, ctx: &Context<Self>) -> Html {
        html! {
            <div>
                <h1>{"3D Engine"}</h1>
                <canvas id="3d-canvas"></canvas>
            </div>
        }
    }
}

fn main() {
    yew::start_app::<ThreeDEngine>();
}
