export interface Menu {
    Id: number;
    IdNode: number;
    Name: string;
    Url: string;
    Icon: string;
    Items: Array<Menu>;
}
