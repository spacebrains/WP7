//JSON2TS
export default interface ILoadTerms {
  _query: Query;
  _options: Options;
  _url: string;
  _parentUrl: string;
  _useCaching: boolean;
  _cachingOptions?: any;
  _cloneParentWasCaching: boolean;
  _cloneParentCacheOptions?: any;
  _requestPipeline?: any;
  _objectPaths: ObjectPaths;
  _selects: any[];
  _batch?: any;
  _batchDependency?: any;
  _ObjectType_: string;
  _ObjectIdentity_: string;
  Name: string;
}

interface ObjectPaths {
  _paths: Path[];
  _relationships: Query;
  _contextIndex: number;
  _siteIndex: number;
  _webIndex: number;
  _xml?: any;
}

interface Path {
  path: string;
  actions: string[];
  id: number;
  replaceAfter: any[];
}

interface Options {
  headers: Query;
}

interface Query {
}