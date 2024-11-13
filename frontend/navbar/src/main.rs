use yew::prelude::*;

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
            <nav>
                <ul>
                    <li><a href="#home">{"Home"}</a></li>
                    <li><a href="#about">{"About"}</a></li>
                    <li><a href="#contact">{"Contact"}</a></li>
                </ul>
            </nav>
        }
    }
}

fn main() {
    yew::start_app::<Navbar>();
}
