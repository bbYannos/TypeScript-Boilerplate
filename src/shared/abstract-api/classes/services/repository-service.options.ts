export class AbstractRepositoryServiceOptions {
  /**
   * Connected or Not --
   * todo: rename mode : draft(dexie only), live(rest only), synchronized(dexie only -- default tolerance)
   */
  public synchronize: boolean = true;

  /**
   * Will load all records before service send isReady$ and then prepare fetchAll$
   */
  public fetchAllOnInit: boolean = false;

  /**
   *  Will load all records in One Request
   *  list(query) will always return all objects (fetchAll$)
   *  Services must have query able to filter Results
   */
  public fetchAllAtOnce: boolean = true;
}

