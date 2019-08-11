import * as React from 'react';
import * as strings from 'Wp7WebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';
import ILoadItems from './interfaces/ILoadItems';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
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
    window: 'List' | 'Warning' | 'Spinner';
    warningMessage: string;
    items: Array<IItems>;
    terms: Array<IDropdownOption>;
}



export default class Wp7 extends React.Component<IWp7Props, {}> {
    private termSetId = 'bd90f94f-896b-4cfa-92dc-668a8f9f58de';

    public state: IState = {
        window: 'Warning',
        warningMessage: strings.MainMessage,
        items: [],
        terms: []
    };

    constructor(props) {
        super(props);
        this.checkData();
    }


    public componentDidUpdate(prevProps: Readonly<IWp7Props>): void {
        if (this.props !== prevProps)
            this.checkData();
    }


    private checkData = () => {
        if (this.props.list && this.props.list.replace(/\s/g, '') !== '') {
            this.setState({ ...this.state, window: 'Spinner' }, this.getItems);
        }
        else {
            this.setState({ ...this.state, window: 'Warning', warningMessage: strings.MainMessage });
        }
    }

    private loadItems = async (url) => {
        const siteUrl = this.props.siteUrl;

        const SP = (await import("@pnp/sp"));
        const WEB = new SP.Web(siteUrl, url);

        const response: ILoadItems = await WEB.get();
        const resultRows = response.PrimaryQueryResult.RelevantResults.Table.Rows;
        const resultRowsWithTerms = resultRows.filter(rows => rows.Cells.find(obj => obj.Key === 'RefinableString51').Value);

        return resultRowsWithTerms;
    }

    private getItems = async () => {
        try {
            const { list } = this.props;
            const url = `_api/search/query?querytext='${escape(list)}'&rowsperpage=0&rowlimit=25&selectproperties='RefinableString50%2cRefinableString51%2cTitle'&clienttype='ContentSearchRegular'`;

            const resultRowsWithTerms = await this.loadItems(url);

            if (resultRowsWithTerms && resultRowsWithTerms.length === 0) {
                this.setState({ ...this.state, window: 'Warning', warningMessage: strings.ResultNotFound });
                console.log('notFound', this.state);
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

                this.setState({ ...this.state, items: items, terms: terms, window: 'List' });
            }
        }
        catch (err) {
            console.error('loadItems', err);
            this.setState({ ...this.state, window: 'Warning', warningMessage: err });
        }
    }

    public filterItems = async (newSearchTerms: string) => {
        try {
            const url = `_api/search/query?querytext='GTSet|%23${this.termSetId}'&rowsperpage=0&rowlimit=10&selectproperties='RefinableString50%2c+RefinableString51%2cTitle'&refiners='RefinableString50%2cRefinableString51'&refinementfilters='RefinableString50:equals("${newSearchTerms}")'&clienttype='ContentSearchRegular'`;

            const resultRowsWithTerms = await this.loadItems(url);

            if (resultRowsWithTerms && resultRowsWithTerms.length === 0)
                this.setState({ ...this.state, window: 'Warning', warningMessage: strings.ResultNotFound });

            else {
                const items = resultRowsWithTerms.map(rows => {
                    const Title = rows.Cells.find(obj => obj.Key === 'Title').Value;
                    const color = rows.Cells.find(obj => obj.Key === 'RefinableString50').Value;

                    return { Title, color };
                });

                this.setState({ ...this.state, items: items, window: 'List' });
            }
        }
        catch (err) {
            console.error('loadItems', err);
            this.setState({ ...this.state, window: 'Warning', warningMessage: err });
        }
    }

    public setSearchTerms = (newSearchTerms: string) => {
        this.filterItems(newSearchTerms);
    }


    private switchWindow = () => {
        switch (this.state.window) {
            case 'List':
                return (
                    <List
                        items={this.state.items}
                        terms={this.state.terms}
                        setSearchTerms={this.setSearchTerms}
                    />
                );
            case 'Warning':
                return <WarningBlock massege={this.state.warningMessage} />;
            case 'Spinner':
                return <Spinner />;
        }
    }

    public render(): React.ReactElement<IWp7Props> {
        return (
            <div >
                {this.switchWindow()}
            </div>
        );
    }
}
