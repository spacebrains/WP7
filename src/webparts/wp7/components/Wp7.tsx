import * as React from 'react';
import styles from './Wp7.module.scss';
import * as strings from 'Wp7WebPartStrings';
import { escape } from '@microsoft/sp-lodash-subset';
import List from "./List/List";
import WarningBlock from './WarningBlock/WarningBlock';
import { Spinner } from 'office-ui-fabric-react/lib/Spinner';
import ILoadItems from './interfaces/IloadItems';

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
    warningMassege: string;
    items: Array<IItems>;
}



export default class Wp7 extends React.Component<IWp7Props, {}> {
    public state: IState = {
        window: 'Warning',
        warningMassege: strings.MainMassege,
        items: []
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
        console.log(this.props.list);
        if (this.props.list && this.props.list != '') {
            this.setState({ ...this.state, window: 'Spinner' });
            this.loadItems();
        }
        else if (this.props.list && this.props.list === '') {
            this.setState({ ...this.state, window: 'Warning', warningMassege: strings.MainMassege });
        }
    }


    private loadItems = async () => {
        try {
            const { siteUrl, list } = this.props;
            const url = `_api/search/query?querytext='${escape(list)}'&rowsperpage=0&rowlimit=25&selectproperties='RefinableString50%2cRefinableString51%2cTitle'&clienttype='ContentSearchRegular'`;

            const SP = (await import("@pnp/sp"));
            const WEB = new SP.Web(siteUrl, url);

            const response: ILoadItems = await WEB.get();
            const resultRows = response.PrimaryQueryResult.RelevantResults.Table.Rows;
            const resultRowsWithTerms = resultRows.filter(rows => rows.Cells.find(obj => obj.Key === 'RefinableString51').Value);
            if (resultRowsWithTerms.length === 0) {
                this.setState({ ...this.state, window: 'Warning', warningMassege: strings.ResultNotFound });
                return null;
            }

            const items = resultRowsWithTerms.map(rows => {
                const Title = rows.Cells.find(obj => obj.Key === 'Title').Value;
                const color = rows.Cells.find(obj => obj.Key === 'RefinableString50').Value;
                return { Title, color };
            });

            console.log(items);
            this.setState({ ...this.state, items: items, window: 'List' });
        }
        catch (err) {
            console.error('loadItems', err);
            this.setState({ ...this.state, window: 'Warning', warningMassege: err });

        }
    }

    private switchWindow = () => {
        switch (this.state.window) {
            case 'List':
                return <List items={this.state.items} />;
            case 'Warning':
                return <WarningBlock massege={this.state.warningMassege} />;
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
