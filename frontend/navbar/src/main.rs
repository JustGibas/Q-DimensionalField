use yew::prelude::*;
use yew::virtual_dom::VNode;
use sidebar::Sidebar;

struct Navbar;

impl Component for Navbar {
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
                { self.render_sidebar() }
            </div>
        }
    }
}

impl Navbar {
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

    fn render_sidebar(&self) -> Html {
        html! {
            <Suspense fallback={html! { <div>{"Loading Sidebar..."}</div> }}>
                <Sidebar />
            </Suspense>
        }
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
        }
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
    yew::start_app::<Navbar>();
}
