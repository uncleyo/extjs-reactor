import React from 'react';
import { ExtReactProvider } from '@extjs/reactor-fiber';

const Panel = "ExtReact::Panel";
const Button = "ExtReact::Button";
const ToggleField = 'ExtReact::ToggleField';
const CheckBoxField = 'ExtReact::CheckBoxField';
const Toolbar = 'ExtReact::Toolbar';
const Spacer = 'ExtReact::Spacer';
const TextField = 'ExtReact::TextField';
const Grid = 'ExtReact::Grid';
const Menu = 'ExtReact::Menu';
const MenuItem = 'ExtReact::MenuItem';
const TitleBar = 'ExtReact::TitleBar';
const Container = 'ExtReact::Container';

ExtReactProvider.setDebug(true);

export default class App extends React.Component {
    
    state = {
        showButton: true,
        showDiv: true, 
        showSpan: true,
        buttonText: 'Click Me',
        showMenu: true
    };

    store = Ext.create('Ext.data.Store', {
        data: [
            { firstName: 'Mark', lastName: 'Brocato' }
        ]
    })

    toggleMenu = () => this.setState({ showMenu: !this.state.showMenu })

    render() {
        const { showMenu, showButton, showDiv, buttonText, showSpan } = this.state;

        return (
            <ExtReactProvider>
                <Container title="App" fullscreen>
                    <TitleBar title="ExtReact on Fiber" docked="top">
                        <Button align="left" iconCls="x-fa fa-bars" handler={this.toggleMenu}/>
                    </TitleBar>
                    <Toolbar docked="top">
                        <TextField placeholder="Button Text..." value={buttonText} onChange={(tb, value) => this.setState({buttonText: value})}/>
                        <CheckBoxField boxLabel="Show div" onChange={(cb, checked) => this.setState({ showDiv: checked })} checked={showDiv}/>
                        <Button text="Menu">
                            <Menu rel="menu">
                                <MenuItem text="Option 1"/>
                                <MenuItem text="Option 2"/>
                                <MenuItem text="Option 3"/>
                            </Menu>
                        </Button>
                    </Toolbar>
                    { showMenu && (
                        <Panel docked="left" width="250" shadow style={{zIndex: 100}}>
                            <div>Menu</div>
                        </Panel>
                    ) }
                    <div>
                        <div>
                            <section>
                                { showDiv && <div>{buttonText}</div> }
                            </section>
                        </div>
                    </div>
                </Container>
            </ExtReactProvider>            
        )
    }

}
