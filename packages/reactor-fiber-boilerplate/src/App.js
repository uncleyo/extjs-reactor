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

ExtReactProvider.setDebug(true);

export default class App extends React.Component {
    
    state = {
        showButton: true,
        showDiv: true, 
        showSpan: true,
        buttonText: 'Click Me'
    };

    store = Ext.create('Ext.data.Store', {
        data: [
            { firstName: 'Mark', lastName: 'Brocato' }
        ]
    })

    render() {
        const { showButton, showDiv, buttonText, showSpan } = this.state;

        return (
            <ExtReactProvider>
                <Panel title="App" shadow fullscreen>
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
                    <div>
                        <div>
                            <section>
                                { showDiv && <div>{buttonText}</div> }
                            </section>
                        </div>
                    </div>
                </Panel>
            </ExtReactProvider>            
        )

        /*return (
            <ExtReactProvider>
                <Panel title="Panel" shadow fullscreen bodyPadding={10} layout="vbox">
                    <Toolbar docked="top">
                        <CheckBoxField boxLabel="Show Button" onChange={(cb, checked) => this.setState({ showButton: checked })} checked={showButton}/>
                        <CheckBoxField boxLabel="Show div" onChange={(cb, checked) => this.setState({ showDiv: checked })} checked={showDiv}/>
                        <CheckBoxField boxLabel="Show span" onChange={(cb, checked) => this.setState({ showSpan: checked })} checked={showSpan}/>
                        <Spacer/>
                        <TextField label="Button Text" value={buttonText} onChange={(tb, value) => this.setState({buttonText: value})}/>
                    </Toolbar>
                    <ToggleField text={buttonText}/>
                    {showDiv && (
                        <div>div {showSpan && <span>span</span>}</div>
                    )}
                    {showButton && <Button text={buttonText}/>}
                    <MyComponent/>

                    <Grid 
                        flex={1} 
                        store={this.store}
                        columns={[
                            { dataIndex: 'firstName', text: 'First Name' },
                            { dataIndex: 'lastName', text: 'Last Name' }
                        ]}
                    />
                </Panel>
            </ExtReactProvider>
        )*/
    }

}


class MyComponent extends React.Component {
    render() {
        return <Button text="In Component"/>
    }
}