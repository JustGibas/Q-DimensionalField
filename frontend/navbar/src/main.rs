use yew::prelude::*;
use yew::virtual_dom::VNode;
use crate::shared_components::{Navbar, ThreeDEngine, MainMenu};

struct NavbarComponent;

impl Component for NavbarComponent {
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
                <nav>
                    <ul>
                        <li><a href="#home">{"Home"}</a></li>
                        <li><a href="#about">{"About"}</a></li>
                        <li><a href="#contact">{"Contact"}</a></li>
                    </ul>
                </nav>
                { self.render_main_menu() }
                { self.render_three_d_engine() }
            </div>
        }
    }
}

impl NavbarComponent {
    fn render_main_menu(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading Main Menu..."}</div> }}>
                <MainMenu />
            </Suspense>
        }
    }

    fn render_three_d_engine(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading 3D Engine..."}</div> }}>
                <ThreeDEngine />
            </Suspense>
        }
    }
}

fn main() {
    yew::start_app::<NavbarComponent>();
}
