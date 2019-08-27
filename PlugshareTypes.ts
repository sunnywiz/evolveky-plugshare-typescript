declare module PlugShare {

    // generated from http://json2ts.com/  and then fixed the namespace above

    export interface ReverseGeocodedAddressComponents {
        postal_code: string;
        country_code: string;
        street_number: string;
        locality: string;
        sublocality_1?: any;
        route: string;
        sublocality_2?: any;
        administrative_area_2: string;
        administrative_area_3?: any;
        sublocality_3?: any;
        administrative_area_1: string;
    }

    export interface Amenity {
        location_id: number;
        type: number;
    }

    export interface ValidOutlet {
        connector: number;
        power: number;
    }

    export interface Network {
        description: string;
        formatted_phone_number: string;
        url: string;
        image: string;
        action_url: string;
        action_name: string;
        phone: string;
        e164_phone_number: string;
        id: number;
        name: string;
    }

    export interface Outlet {
        available?: any;
        description?: any;
        power: number;
        volts?: any;
        id: number;
        watts?: any;
        connector: number;
        connector_type: number;
        amps?: any;
        available_changed_at?: any;
        outlet_index?: any;
    }

    export interface Promo {
        link_url?: any;
        tag?: any;
        image_url?: any;
        name: string;
        link_action?: any;
        lat?: any;
        lng?: any;
        image_url_2x?: any;
        id: number;
        app_id?: any;
    }

    export interface Station {
        volts?: any;
        network_ext_id?: any;
        qr_enabled?: any;
        cost: number;
        pwps_version?: any;
        location_id: number;
        id: number;
        cost_description: string;
        pre_charge_instructions?: any;
        nissan_nctc: boolean;
        network: Network;
        payment_enabled?: any;
        available: number;
        outlets: Outlet[];
        hours: string;
        promos: Promo[];
        ocpp_version?: any;
        kilowatts?: any;
        requiresAccessCard: boolean;
        manufacturer: string;
        name?: any;
        network_id: number;
        created_at: Date;
        amps?: any;
        model: string;
        available_changed_at?: any;
    }

    export interface Photo {
        user_id: number;
        url: string;
        created_at: Date;
        thumbnail: string;
        caption: string;
        thumbnail2x: string;
        order: number;
        id: number;
    }

    export interface User {
        last_name: string;
        hide_address: boolean;
        charger_type: number;
        country_code: string;
        language_code?: any;
        allow_promo_email: boolean;
        id: number;
        notify_nearby: number;
        first_name: string;
        vehicle_color: number;
        last_login: Date;
        allow_notifications: boolean;
        vehicle_description: string;
        phone: string;
        e164_phone_number: string;
        hide_phone: boolean;
        vehicle_type: number;
        about: string;
        notify_nearby_radius: number;
        receive_grid_alerts: number;
        created_at: Date;
        photos: Photo[];
        formatted_phone_number: string;
        vehicle_subtype: number;
    }

    export interface Review {
        vehicle_name: string;
        comment: string;
        rating: number;
        volts?: any;
        created_at: Date;
        connector_type: number;
        station_id: number;
        waiting: boolean;
        user: User;
        amps?: any;
        vehicle_type: number;
        id: number;
    }

    export interface AllPromo {
        link_url?: any;
        tag?: any;
        image_url?: any;
        name: string;
        link_action?: any;
        lat?: any;
        lng?: any;
        image_url_2x?: any;
        id: number;
        app_id?: any;
    }

    export interface Location {
        total_reviews: number;
        reverse_geocoded_address_components: ReverseGeocodedAddressComponents;
        opening_date: string;
        nissan_nctc: boolean;
        payment_enabled?: any;
        reverse_geocoded_address: string;
        amenities: Amenity[];
        latitude: number;
        open247: boolean;
        valid_outlets: ValidOutlet[];
        phone: string;
        e164_phone_number: string;
        locked: boolean;
        title_description: string;
        name: string;
        icon_type: string;
        stations: Station[];
        enabled: boolean;
        longitude: number;
        reviews: Review[];
        under_repair: boolean;
        poi_name: string;
        locale: string;
        updated_at: Date;
        cost: boolean;
        pwps_version?: any;
        id: number;
        datasources: any[];
        cost_description: string;
        access: number;
        description: string;
        custom_ports: string;
        confidence: number;
        hours: string;
        all_promos: AllPromo[];
        address: string;
        parking_type_name: string;
        icon: string;
        photos: any[];
        url: string;
        created_at: Date;
        promos: any[];
        formatted_phone_number: string;
        coming_soon?: any;
    }

}

