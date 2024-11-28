use yew::prelude::*;
use yew::virtual_dom::VNode;
use sidebar::Sidebar;

struct MainMenu;

impl Component for MainMenu {
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
                <h1>{"Main Menu"}</h1>
                <ul>
                    <li><a href="#start">{"Start Game"}</a></li>
                    <li><a href="#settings">{"Settings"}</a></li>
                    <li><a href="#exit">{"Exit"}</a></li>
                </ul>
                { self.render_navbar() }
                { self.render_three_d_engine() }
                { self.render_sidebar() }
            </div>
        }
    }
}

impl MainMenu {
    fn render_navbar(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading Navbar..."}</div> }}>
                <Navbar />
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

    fn render_sidebar(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading Sidebar..."}</div> }}>
                <Sidebar />
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

#[function_component(ThreeDEngine)]
fn three_d_engine() -> Html {
    html! {
        <div>
            <h1>{"3D Engine"}</h1>
            <canvas id="3d-canvas"></canvas>
        </div>
    }
}

fn main() {
    yew::start_app::<MainMenu>();
}
