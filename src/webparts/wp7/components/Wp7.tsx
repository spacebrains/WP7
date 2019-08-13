import * as React from 'react';
import * as strings from 'Wp7WebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';
import Spinner from './Spinner/Spinner';
import { IDropdownOption } from "office-ui-fabric-react/lib/Dropdown";
import List from "./List/List";
import WarningBlock from './WarningBlock/WarningBlock';


export interface IItems {
    Title: string;
    ID: string;
}

export interface IWp7Props {
    list: string;
    siteUrl: string;
}

interface IState {
    window: 'List' | 'Warning';
    isLoading: boolean;
    warningMessage: string;
    items: Array<IItems>;
    terms: Array<IDropdownOption>;
    filterСondition: string;
}



export default class Wp7 extends React.Component<IWp7Props, {}> {
    private termSetId = 'bd90f94f-896b-4cfa-92dc-668a8f9f58de';

    public state: IState = {
        window: 'Warning',
        warningMessage: 'Wait, pleast :3',
        isLoading: true,
        items: [],
        terms: [],
        filterСondition: strings.ShowAll
    };


    public componentDidMount(): void {
        this.checkData();
    }

    public componentDidUpdate(prevProps: Readonly<IWp7Props>): void {
        if (this.props !== prevProps)
            this.checkData();
    }


    private checkData = async () => {
        if (this.props.list && this.props.list.replace(/\s/g, '') !== '') {
            this.setState({ ...this.state, isLoading: true });
            this.getItems();
        }
        else {
            this.setState({ ...this.state, window: 'Warning', warningMessage: strings.MainMessage, isLoading: false });
        }
    }

    private _loadItems = async (url:string) => {
        const siteUrl = this.props.siteUrl;
        const SP = (await import("@pnp/sp"));
        const WEB = new SP.Web(siteUrl, url);
        const response = await WEB.get();
        const resultRows = response.PrimaryQueryResult.RelevantResults.Table.Rows;
        const resultRowsWithTerms = resultRows.filter(rows => rows.Cells.find(obj => obj.Key === 'RefinableString51').Value);

        return resultRowsWithTerms;
    }

    private getItems = async () => {
        try {
            const { list } = this.props;
            const url = `_api/search/query?querytext='${escape(list)}'&rowsperpage=0&selectproperties='RefinableString50%2cRefinableString51%2cTitle'&clienttype='ContentSearchRegular'`;

            const resultRowsWithTerms = await this._loadItems(url);

            if (resultRowsWithTerms && resultRowsWithTerms.length === 0) {
                this.setState({ ...this.state, window: 'Warning', warningMessage: strings.ResultNotFound, isLoading: false });
            }

            else {
                let terms: Array<IDropdownOption> = [];
                const items = resultRowsWithTerms.map(rows => {
                    const Title = rows.Cells.find(obj => obj.Key === 'Title').Value;
                    const color = rows.Cells.find(obj => obj.Key === 'RefinableString50').Value;
                    if (!terms.find(t => t.key === color))
                        terms = [...terms, { text: color, key: color }];

                    return { Title, color };
                });

                this.setState({
                    ...this.state,
                    items: items,
                    terms: terms,
                    window: 'List',
                    filterСondition: strings.ShowAll,
                    isLoading: false
                });
            }
        }

        catch (err) {
            console.error('getItems', err.Error);
            this.setState({
                ...this.state,
                window: 'Warning',
                warningMessage: err.message,
                isLoading: false
            });
        }
    }

    public filterItems = async (newSearchTerms: string) => {
        try {
            const url = `_api/search/query?querytext='GTSet|%23${this.termSetId}'&rowsperpage=0&selectproperties='RefinableString50%2c+RefinableString51%2cTitle'&refiners='RefinableString50%2cRefinableString51'&refinementfilters='RefinableString50:equals("${newSearchTerms}")'&clienttype='ContentSearchRegular'`;

            const resultRowsWithTerms = await this._loadItems(url);
            if (resultRowsWithTerms && resultRowsWithTerms.length === 0)
                this.setState({ ...this.state, window: 'Warning', warningMessage: strings.ResultNotFound, isLoading: false });

            else {
                const items = resultRowsWithTerms.map(rows => {
                    const Title = rows.Cells.find(obj => obj.Key === 'Title').Value;
                    const color = rows.Cells.find(obj => obj.Key === 'RefinableString50').Value;

                    return { Title, color };
                });

                this.setState({
                    ...this.state,
                    items: items,
                    window: 'List',
                    filterСondition: newSearchTerms,
                    isLoading: false
                });
            }
        }

        catch (err) {
            console.error("filterItems",err);
            this.setState({
                ...this.state,
                window: 'Warning',
                warningMessage: err.message,
                isLoading: false
            });
        }
    }

    public setFilter = (newFilterCondition: string): void => {
        if (newFilterCondition === this.state.filterСondition)
            return;

        this.setState({ ...this.state, isLoading: true });
        if (newFilterCondition === strings.ShowAll) {
            this.getItems();
        }
        else
            this.filterItems(newFilterCondition);
    }


    private switchWindow = () => {
        let component: JSX.Element;

        switch (this.state.window) {
            case 'List':
                component = (
                    <List
                        items={this.state.items}
                        terms={this.state.terms}
                        setFilter={this.setFilter}
                        filterСondition={this.state.filterСondition}
                    />
                );
                break;
            case 'Warning':
                component = <WarningBlock massege={this.state.warningMessage} />;
                break;
        }

        return this.state.isLoading ? <><Spinner /> {component}</> : component;
    }

    public render(): React.ReactElement<IWp7Props> {
        return (
            <div >
                {this.switchWindow()}
            </div>
        );
    }
}
