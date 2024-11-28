use yew::prelude::*;

struct Sidebar;

impl Component for Sidebar {
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
                <h1>{"Sidebar"}</h1>
                <ul>
                    <li><a href="#link1">{"Link 1"}</a></li>
                    <li><a href="#link2">{"Link 2"}</a></li>
                    <li><a href="#link3">{"Link 3"}</a></li>
                </ul>
            </div>
        }
    }
}

fn main() {
    yew::start_app::<Sidebar>();
}
