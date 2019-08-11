import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  PropertyPaneTextField,
  IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';

import * as strings from 'Wp7WebPartStrings';
import Wp7 from './components/Wp7';
import { IWp7Props } from './components/Wp7';

export interface IWp7WebPartProps {
  list: string;
}

export default class Wp7WebPart extends BaseClientSideWebPart<IWp7WebPartProps> {

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('list', {
                  label: strings.DescriptionListsFieldLabel,
                  placeholder: '...'
                })
              ]
            }
          ]
        }
      ]
    };
  }


  public render(): void {
    const element: React.ReactElement<IWp7Props > = React.createElement(
      Wp7,
      {
        list: this.properties.list,
        siteUrl:'https://mastond.sharepoint.com/',
      }
    );

    ReactDom.render(element, this.domElement);
  }



  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
