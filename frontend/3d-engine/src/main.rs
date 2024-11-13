use yew::prelude::*;
use yew::virtual_dom::VNode;

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
                { self.render_navbar() }
                { self.render_main_menu() }
            </div>
        }
    }
}

impl ThreeDEngine {
    fn render_navbar(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading Navbar..."}</div> }}>
                <Navbar />
            </Suspense>
        }
    }

    fn render_main_menu(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading Main Menu..."}</div> }}>
                <MainMenu />
            </Suspense>
        }
    }
}

#[function_component(Navbar)]
fn navbar() -> Html {
    html! {
        <div>
            <nav>
                <ul>
                    <li><a href="#home">{"Home"}</a></li>
                    <li><a href="#about">{"About"}</a></li>
                    <li><a href="#contact">{"Contact"}</a></li>
                </ul>
            </nav>
        </div>
    }
}

#[function_component(MainMenu)]
fn main_menu() -> Html {
    html! {
        <div>
            <h1>{"Main Menu"}</h1>
            <ul>
                <li><a href="#start">{"Start Game"}</a></li>
                <li><a href="#settings">{"Settings"}</a></li>
                <li><a href="#exit">{"Exit"}</a></li>
            </ul>
        </div>
    }
}

fn main() {
    yew::start_app::<ThreeDEngine>();
}
